# server/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from dotenv import load_dotenv
from config import app, db, api
from models import User, ArtistPortfolio, ProjectSubmission, ArtistSubmission, db
import bcrypt
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import os

load_dotenv()

if not os.getenv('CLOUDINARY_CLOUD_NAME') or not os.getenv('CLOUDINARY_API_KEY') or not os.getenv('CLOUDINARY_API_SECRET'):
    raise ValueError('Cloudinary configuration is missing or incomplete')

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

cloudinary.config( 
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)
if not os.getenv('CLOUDINARY_CLOUD_NAME') or not os.getenv('CLOUDINARY_API_KEY') or not os.getenv('CLOUDINARY_API_SECRET'):
    raise ValueError('Cloudinary configuration is missing or incomplete')

print(os.getenv('CLOUDINARY_CLOUD_NAME'))
print(os.getenv('CLOUDINARY_API_KEY'))
print(os.getenv('CLOUDINARY_API_SECRET'))
    
upload_result = cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg")
print("Uploaded image URL:", upload_result["secure_url"])
# Upload an image
# upload_result = cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", public_id="shoes")
# print(upload_result["secure_url"])


optimize_url, _ = cloudinary_url("shoes", fetch_format="auto", quality="auto")
print(optimize_url)


auto_crop_url, _ = cloudinary_url("shoes", width=500, height=500, crop="auto", gravity="auto")
print(auto_crop_url)

# db = SQLAlchemy(app)
db.init_app(app)
migrate = Migrate(app, db)

api = Api(app)
CORS(app)

@app.route('/')
def index():
    return '<h1>WorldBuild API</h1>'

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=data['password'],
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


@app.route('/api/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200


@app.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        user.password_hash = hashed_password.decode('utf-8')

    db.session.commit()
    return jsonify(user.to_dict()), 200

@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

# In server/app.py

@app.route('/api/artists/<int:id>', methods=['GET'])
def get_artist_portfolio(id):
    artist = User.query.get(id)
    if not artist or not artist.portfolios:
        return jsonify({'error': 'Artist not found or no portfolio'}), 404

    portfolios = artist.portfolios
    return jsonify([portfolio.to_dict() for portfolio in portfolios]), 200

@app.route('/api/creators/<int:id>', methods=['GET'])
def get_creator_projects(id):
    creator = User.query.get(id)
    if not creator or not creator.projects:
        return jsonify({'error': 'Creator not found or no projects'}), 404

    projects = creator.projects
    return jsonify([project.to_dict() for project in projects]), 200

@app.route('/api/portfolios', methods=['POST'])
def create_portfolio():
    data = request.form
    file= request.files.get('profile_image')

    print(data)
    print(file)

    if file:
        upload_result = cloudinary.uploader.upload(file)
        profile_image_url = upload_result['secure_url']
    else:
        profile_image_url = ''

    if not data.get('artist_name') or not data.get('user_id'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    new_portfolio = ArtistPortfolio(
        artist_name=data['artist_name'],
        bio=data.get('bio', ''),
        profile_image=profile_image_url,
        user_id=data['user_id'],
    )
    db.session.add(new_portfolio)
    db.session.commit()
    return jsonify(new_portfolio.to_dict()), 201

@app.route('/api/portfolios', methods=['GET'])
def get_portfolios():
    portfolios = ArtistPortfolio.query.all()
    if not portfolios:
        return jsonify([]), 200
    return jsonify([portfolio.to_dict() for portfolio in portfolios]), 200

@app.route('/api/portfolios/<int:id>', methods=['POST'])
def add_image_to_portfolio(id):
    portfolio = ArtistPortfolio.query.get(id)
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    
    file= request.files.get('image')
    if not file:
        return jsonify({'error': 'No image file provided'}), 400
    
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result['secure_url']

    portfolio.images.append(image_url)
    db.session.commit()
    
    return jsonify({'image_url': image_url}), 201

@app.route('/api/portfolios/<int:id>', methods=['GET'])
def get_portfolio(id):
    portfolio = ArtistPortfolio.query.filter_by(id=id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    return jsonify(portfolio.to_dict()), 200

@app.route('/api/portfolios/<int:id>', methods=['PUT'])
def update_portfolio(id):
    portfolio = ArtistPortfolio.query.get(id)
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    data = request.get_json()
    if 'artist_name' in data:
        portfolio.artist_name = data['artist_name']
    if 'bio' in data:
        portfolio.bio = data['bio']
    if 'profile_image' in data:
        portfolio.profile_image = data['profile_image']
    # if 'user_id' in data:
    #     portfolio.user_id = data['user_id']

    db.session.commit()
    return jsonify(portfolio.to_dict()), 200

@app.route('/api/portfolios/<int:id>', methods=['DELETE'])
def delete_portfolio(id):
    portfolio = ArtistPortfolio.query.get(id)
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    db.session.delete(portfolio)
    db.session.commit()
    return jsonify({'message': 'Portfolio deleted successfully'}), 200

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.get_json()

    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    new_project = ProjectSubmission(
        project_title=data['project_title'],
        description=data['description'],
        keywords=data.get('keywords', ''),
        user_id=user_id
    )
    db.session.add(new_project)
    db.session.commit()
    
    return jsonify(new_project.to_dict()), 201

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = ProjectSubmission.query.all()
    if not projects:
        return jsonify([]), 200
    return jsonify([project.to_dict() for project in projects]), 200

@app.route('/api/projects/<int:id>', methods=['GET'])
def get_project(id):
    project = ProjectSubmission.query.get(id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project.to_dict()), 200

@app.route('/api/projects/<int:id>', methods=['PUT'])
def update_project(id):
    project = ProjectSubmission.query.get(id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    data = request.get_json()
    if 'project_title' in data:
        project.project_title = data['project_title']
    if 'description' in data:
        project.description = data['description']
    if 'keywords' in data:
        project.keywords = data['keywords']
    
    db.session.commit()
    return jsonify(project.to_dict()), 200

@app.route('/api/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    project = ProjectSubmission.query.get(id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted successfully'}), 200

@app.route('/api/projects/<int:id>/submit', methods=['POST'])
def submit_to_project(id):
    project = ProjectSubmission.query.get(id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    data = request.get_json()
    
    new_submission = ArtistSubmission(
        design_url=data['design_url'],
        description=data['description'],
        project_id=id,
        portfolio_id=data.get('portfolio_id')
    )
    db.session.add(new_submission)
    db.session.commit()
    
    return jsonify(new_submission.to_dict()), 201

# Run the Flask server on port 5555
if __name__ == '__main__':
    app.run(port=5555, debug=True)
