#!/usr/bin/env python3
from random import randint, choice as rc

from faker import Faker

from dotenv import load_dotenv
from app import app
from models import db, User, ArtistPortfolio, ProjectSubmission, ArtistSubmission
import os

load_dotenv()

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
