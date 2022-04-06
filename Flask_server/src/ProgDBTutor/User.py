# see https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
from flask import Flask, request, jsonify, make_response, session, flash, redirect, url_for
from flask.templating import render_template

import uuid # for public id
from  werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess
import os

# imports for PyJWT authentication
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask_sqlalchemy import SQLAlchemy







# Database ORMs
class User():
    def __init__(self,db):
        id = db.Column(db.Integer, primary_key=True)
        public_id = db.Column(db.String(50), unique = True)
        name = db.Column(db.String(100))
        email = db.Column(db.String(70), unique = True)
        password = db.Column(db.String(100))

    # decorator for verifying the JWT
    def token_required(self,f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            # jwt is passed in the request header
            if 'x-access-token' in request.headers:
                token = request.headers['x-access-token']
            # return 401 if token is not passed
            if not token:
                return jsonify({'message' : 'Token is missing !!'}), 401
            try:
                # decoding the payload to fetch the stored details
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                current_user = User.query\
                    .filter_by(public_id = data['public_id'])\
                    .first()
            except:
                return jsonify({
                    'message' : 'Token is invalid !!'
                }), 401
            # returns the current logged in users contex to the routes
            return  f(current_user, *args, **kwargs)

        return decorated

    # User Database Route
    # this route sends back list of users users
    # @app.route('/api/user', methods =['GET'])
    # @token_required
    def get_all_users(current_user):
        # querying the database
        # for all the entries in it
        users = User.query.all()
        # converting the query objects
        # to list of jsons
        output = []
        for user in users:
            # appending the user data json
            # to the response list
            output.append({
                'public_id': user.public_id,
                'name' : user.name,
                'email' : user.email
            })

        return jsonify({'users': output})

    # route for logging user in
    # @app.route('/api/login', methods =['POST'])
    def login():
        # creates dictionary of form data
        auth = request.form

        if not auth or not auth.get('email') or not auth.get('password'):
            # returns 401 if any email or / and password is missing
            return make_response(
                'Could not verify',
                401,
                {'WWW-Authenticate' : 'Basic realm ="Login required !!"'}
            )

        user = User.query\
            .filter_by(email = auth.get('email'))\
            .first()

        if not user:
            # returns 401 if user does not exist
            return make_response(
                'Could not verify',
                401,
                {'WWW-Authenticate' : 'Basic realm ="User does not exist !!"'}
            )

        if check_password_hash(user.password, auth.get('password')):
            # generates the JWT Token
            token = jwt.encode({
                'public_id': user.public_id,
                'exp' : datetime.utcnow() + timedelta(minutes = 30)
            }, app.config['SECRET_KEY'])

            return make_response(jsonify({'token' : token}), 201)
        # returns 403 if password is wrong
        return make_response(
            'Could not verify',
            403,
            {'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'}
        )

    # signup route
    # @app.route('/api/signup', methods =['POST'])
    def signup():
        # creates a dictionary of the form data
        data = request.form

        # gets name, email and password
        name, email = data.get('name'), data.get('email')
        password = data.get('password')

        # checking for existing user
        user = User.query\
            .filter_by(email = email)\
            .first()
        if not user:
            # database ORM object
            user = User(
                public_id = str(uuid.uuid4()),
                name = name,
                email = email,
                password = generate_password_hash(password)
            )
            # insert user
            db.session.add(user)
            db.session.commit()

            return make_response('Successfully registered.', 201)
        else:
            # returns 202 if user already exists
            return make_response('User already exists. Please Log in.', 202)