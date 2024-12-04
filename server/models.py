# models.py

from config import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    portfolios = db.relationship('ArtistPortfolio', backref='user', lazy=True)
    projects = db.relationship('ProjectSubmission', backref='user', lazy=True)

    serialize_rules = ('-password_hash', '-portfolios.user', '-projects.user')

    # Set a hashed password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Check if the provided password is correct
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ArtistPortfolio(db.Model):
    __tablename__ = 'portfolios'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    submissions = db.relationship('ArtistSubmission', back_populates='portfolio', lazy=True)
    serialize_rules = ('-submissions.portfolio',)

class ProjectSubmission(db.Model, SerializerMixin):
    __tablename__ = 'project_submissions'

    id = db.Column(db.Integer, primary_key=True)
    project_title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    artist_submissions = db.relationship('ArtistSubmission', back_populates='project', lazy=True)
    serialize_rules = ('-artist_submissions.project',)

class ArtistSubmission(db.Model, SerializerMixin):
    __tablename__ = 'artist_submissions'

    id = db.Column(db.Integer, primary_key=True)
    design_url = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project_submissions.id'), nullable=False)

    portfolio = db.relationship('ArtistPortfolio', back_populates='submissions', lazy=True)
    project = db.relationship('ProjectSubmission', back_populates='artist_submissions', lazy=True)
    
    serialize_rules = ('-portfolio.submissions', '-project.artist_submissions')