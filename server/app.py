# app.py

from flask import request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from flask_session import Session
from auth import auth_bp
from config import app, db
from models import User, ArtistPortfolio, ProjectSubmission, ArtistSubmission
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import cloudinary
import cloudinary.uploader
import os
from datetime import timedelta

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
Session(app) # Initialize Flask-Session

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

# Run the server
if __name__ == '__main__':
    app.run(port=5555)
