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

    portfolios = db.relationship('ArtistPortfolio', back_populates='user', lazy=True)
    projects = db.relationship('ProjectSubmission', backref='user', lazy=True)

    serialize_rules = ('-password_hash', '-portfolios.user', '-projects.user')

    # Set a hashed password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Check if the provided password is correct
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    caption = db.Column(db.String)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('artist_portfolios.id'))

    # Relationships
    portfolio = db.relationship('ArtistPortfolio', back_populates='images')

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'caption': self.caption,
            'portfolio_id': self.portfolio_id
        }

class ArtistPortfolio(db.Model):
    __tablename__ = 'artist_portfolios'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    bio = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    user = db.relationship('User', back_populates='portfolios')
    images = db.relationship('Image', back_populates='portfolio', cascade='all, delete-orphan')
    submissions = db.relationship('ArtistSubmission', back_populates='portfolio', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'artist_name': self.name,
            'bio': self.bio,
            'user_id': self.user_id,
            'images': [image.to_dict() for image in self.images]
        }

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
    
    portfolio_id = db.Column(db.Integer, db.ForeignKey('artist_portfolios.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project_submissions.id'), nullable=False)

    portfolio = db.relationship('ArtistPortfolio', back_populates='submissions', lazy=True)
    project = db.relationship('ProjectSubmission', back_populates='artist_submissions', lazy=True)
    
    serialize_rules = ('-portfolio.submissions', '-project.artist_submissions')