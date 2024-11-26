# models.py

from config import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin

class User(db.Model, UserMixin, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password_hash = db.Column(db.String)

    portfolios = db.relationship('ArtistPortfolio', back_populates='user', lazy=True)
    projects = db.relationship('ProjectSubmission', back_populates='user', lazy=True)

    serialize_rules = ('-password_hash', '-portfolios.user', '-projects.user')

    # Set a hashed password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Check if the provided password is correct
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ArtistPortfolio(db.Model, SerializerMixin):
    __tablename__ = 'artist_portfolios'

    id = db.Column(db.Integer, primary_key=True)
    artist_name = db.Column(db.String, nullable=False)
    bio = db.Column(db.String)
    profile_image = db.Column(db.String)  # Link to Cloudinary image
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='portfolios')
    submissions = db.relationship('ArtistSubmission', back_populates='portfolio', lazy=True)

    serialize_rules = ('-submissions',)

class ProjectSubmission(db.Model, SerializerMixin):
    __tablename__ = 'project_submissions'

    id = db.Column(db.Integer, primary_key=True)
    project_title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='projects')
    artist_submissions = db.relationship('ArtistSubmission', back_populates='project', lazy=True)

    serialize_rules = ('-artist_submissions',)

class ArtistSubmission(db.Model, SerializerMixin):
    __tablename__ = 'artist_submissions'

    id = db.Column(db.Integer, primary_key=True)
    design_url = db.Column(db.String, nullable=False)  # Link to Cloudinary image
    description = db.Column(db.Text, nullable=False)

    portfolio = db.relationship('ArtistPortfolio', back_populates='submissions', lazy=True)
    project = db.relationship('ProjectSubmission', back_populates='artist_submissions', lazy=True)
    
    portfolio_id = db.Column(db.Integer, db.ForeignKey('artist_portfolios.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project_submissions.id'), nullable=False)

    serialize_rules = ('-portfolio',)