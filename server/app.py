# server/app.py
from flask import Flask
from flask_restful import Api

app = Flask(__name__)

api = Api(app)

# test if the server is running
@app.route('/')
def index():
    return '<h1>WorldBuild API</h1>'


@app.route('/api/projects')
def get_projects():
    return {'projects': []}

# Run the Flask server on port 5555
if __name__ == '__main__':
    app.run(port=5555, debug=True)


# #!/usr/bin/env python3

# # Standard library imports

# # Remote library imports
# from flask import request
# from flask_restful import Resource

# # Local imports
# from config import app, db, api
# # Add your model imports


# # Views go here!

# @app.route('/')
# def index():
#     return '<h1>Project Server</h1>'


# if __name__ == '__main__':
#     app.run(port=5555, debug=True)

