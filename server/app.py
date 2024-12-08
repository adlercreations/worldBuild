# app.py

from flask import request, jsonify, Flask, make_response, session
from dotenv import load_dotenv
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from auth import auth_bp
from config import app, db, api
from models import User, ArtistPortfolio, Image, ProjectSubmission, ArtistSubmission
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import cloudinary
import cloudinary.uploader
import os
from datetime import timedelta
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

# Configure CORS with credentials support
CORS(app, 
     supports_credentials=True, 
     origins=['http://localhost:5173'],
     allow_headers=['Content-Type'],
     expose_headers=['Access-Control-Allow-Credentials'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Comfigure Flask app with the secret key for secure session handling
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem' # Store sessions in filesystem
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_PERMANENT'] = False 

# Register the authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

# Configure Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Redirect if user is not logged in

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.before_request
def log_request_info():
    print("Headers: %s", request.headers)
    print("Body: %s", request.get_data())

@app.route('/api/portfolios', methods=['GET'])
def get_portfolios():
    portfolios = ArtistPortfolio.query.all()
    return jsonify([portfolio.to_dict() for portfolio in portfolios]), 200

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = ProjectSubmission.query.all()
    return jsonify([project.to_dict() for project in projects]), 200

@app.route('/api/projects', methods=['POST'])
def create_project():
    try:
        data = request.get_json()
        new_project = ProjectSubmission(
            project_title=data['project_title'],
            description=data['description'],
            keywords=data.get('keywords'),
            user_id=data['user_id']
        )
        db.session.add(new_project)
        db.session.commit()
        
        # Convert to dictionary before returning
        project_dict = {
            'id': new_project.id,
            'project_title': new_project.project_title,
            'description': new_project.description,
            'keywords': new_project.keywords,
            'user_id': new_project.user_id
        }
        return jsonify(project_dict), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/auth/check-session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify({'id': current_user.id, 'username': current_user.username, 'email': current_user.email})
    else:
        return jsonify(None), 401

# Registration route
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)  # Hash password

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'User registration failed', 'details': str(e)}), 500

# Login route
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({
            'message': 'Logged in successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Logout route
@app.route('/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

# Example protected route
@app.route('/api/protected', methods=['GET'])
@login_required
def protected_route():
    return jsonify({
        'message': f'Hello, {current_user.username}! You have accessed a protected route.'
    }), 200

# Update your Flask session configuration
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(days=7)
)

# Configuration for file uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/portfolio/images', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return {'error': 'No file part'}, 400
    
    file = request.files['image']
    if file.filename == '':
        return {'error': 'No selected file'}, 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create uploads directory if it doesn't exist
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Save to database
        caption = request.form.get('caption', '')
        new_image = Image(
            url=f'/uploads/{filename}',
            caption=caption,
            user_id=session.get('user_id')
        )
        db.session.add(new_image)
        db.session.commit()
        
        return {'message': 'Image uploaded successfully', 'image': new_image.to_dict()}, 200
    
    return {'error': 'File type not allowed'}, 400

@app.route('/api/portfolios/user/<int:user_id>')
def get_user_portfolios(user_id):
    portfolios = ArtistPortfolio.query.filter_by(user_id=user_id).all()
    return jsonify([portfolio.to_dict() for portfolio in portfolios])

@app.route('/api/portfolios/<int:portfolio_id>/upload', methods=['POST'])
def upload_portfolio_image(portfolio_id):
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Get portfolio
            portfolio = ArtistPortfolio.query.get(portfolio_id)
            if not portfolio:
                return jsonify({"error": "Portfolio not found"}), 404
            
            # Save file
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Update portfolio
            portfolio.image_url = f"/uploads/{filename}"
            db.session.commit()
            
            return jsonify({"message": "Image uploaded successfully", "portfolio": portfolio.to_dict()}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/portfolios', methods=['POST'])
def create_portfolio():
    try:
        print("Received portfolio creation request") # Debug log
        
        # Check if file was uploaded
        if 'profile_image' not in request.files:
            print("No file in request") # Debug log
            return jsonify({"error": "No image file provided"}), 400
            
        file = request.files['profile_image']
        if file.filename == '':
            print("No selected file") # Debug log
            return jsonify({"error": "No selected file"}), 400

        # Get form data
        artist_name = request.form.get('artist_name')
        bio = request.form.get('bio')
        user_id = request.form.get('user_id')

        print(f"Received data: artist_name={artist_name}, bio={bio}, user_id={user_id}") # Debug log

        if file and allowed_file(file.filename):
            try:
                # Save file
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                
                # Create portfolio
                new_portfolio = ArtistPortfolio(
                    artist_name=artist_name,
                    bio=bio,
                    user_id=user_id,
                    image_url=f"/uploads/{filename}"
                )
                
                db.session.add(new_portfolio)
                db.session.commit()
                
                print("Portfolio created successfully") # Debug log
                return jsonify({"message": "Portfolio created successfully", "portfolio": new_portfolio.to_dict()}), 201
                
            except Exception as e:
                print(f"Error creating portfolio: {str(e)}") # Debug log
                db.session.rollback()
                return jsonify({"error": str(e)}), 500
                
        return jsonify({"error": "File type not allowed"}), 400
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}") # Debug log
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolios/user/<int:user_id>/upload', methods=['POST'])
def upload_user_portfolio_image(user_id):
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        caption = request.form.get('caption', '')
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(file)
        
        # Get or create portfolio for user
        portfolio = ArtistPortfolio.query.filter_by(user_id=user_id).first()
        if not portfolio:
            portfolio = ArtistPortfolio(
                user_id=user_id,
                name=f"Portfolio {user_id}",
                bio="My artwork collection"
            )
            db.session.add(portfolio)
            db.session.commit()
        
        # Create new image with Cloudinary URL
        image = Image(
            url=upload_result['secure_url'],
            caption=caption,
            portfolio_id=portfolio.id
        )
        db.session.add(image)
        db.session.commit()
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'url': image.url,
            'caption': image.caption
        }), 200
        
    except Exception as e:
        print(f"Error during upload: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Add this new route to get a single portfolio by ID
@app.route('/api/portfolios/<int:portfolio_id>')
def get_portfolio(portfolio_id):
    try:
        portfolio = ArtistPortfolio.query.get(portfolio_id)
        if not portfolio:
            return jsonify({"error": "Portfolio not found"}), 404
            
        return jsonify(portfolio.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolios/images/<int:image_id>', methods=['DELETE'])
def delete_portfolio_image(image_id):
    try:
        image = Image.query.get(image_id)
        if not image:
            return jsonify({'error': 'Image not found'}), 404
            
        # Check if the current user owns the portfolio
        portfolio = ArtistPortfolio.query.get(image.portfolio_id)
        if not portfolio or portfolio.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
            
        db.session.delete(image)
        db.session.commit()
        
        return jsonify({'message': 'Image deleted successfully'}), 200
        
    except Exception as e:
        print(f"Error deleting image: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        project = ProjectSubmission.query.get(project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
            
        # Check if the current user owns the project
        if project.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized'}), 403
            
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({'message': 'Project deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:id>', methods=['GET'])
def get_project(id):
    project = ProjectSubmission.query.get(id)
    if not project:
        return {'error': 'Project not found'}, 404
    return project.to_dict(), 200

# Run the server
if __name__ == '__main__':
    app.run(port=5555)
