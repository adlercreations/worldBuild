# auth.py

from flask import Blueprint, request, jsonify, session
from config import db
from models import User
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# Registration route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'Email already registered'}), 409
        
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    user = User(
        username=data.get('username'),
        email=data.get('email')
    )
    user.set_password(data.get('password'))
    
    try:
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        login_user(user)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

# Logout route
@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    print("Check-session route hit")  # Debug log
    print(f"Is authenticated: {current_user.is_authenticated}")  # Debug log
    if current_user.is_authenticated:
        return jsonify({
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email
        }), 200
    return jsonify({'error': 'Not authenticated'}), 401