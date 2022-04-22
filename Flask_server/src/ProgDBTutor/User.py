# see https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
from flask import Flask, request, jsonify, make_response, session, flash, redirect, url_for
from flask.templating import render_template

import uuid # for public id
from  werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess
import os
from psycopg2 import sql

# imports for PyJWT authentication
import jwt
from datetime import datetime, timedelta
from functools import wraps

class User():
    def __init__(self, app):
        database = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'],
                                userPassword=config_data['password'], dbhost=config_data['host'],
                                dbport=config_data['port'])
        self.connection = database.get_connection()
        self.cursor = self.connection.cursor()
        self.app = app

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
                data = jwt.decode(token, self.app.config['SECRET_KEY'], algorithms=['HS256'])
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

    # route for logging user in
    # @app.route('/api/login', methods =['POST'])
    def login(self, email, password):
        select = "SELECT users.email, users.password, users.public_id  FROM users WHERE email=%s;"
        self.cursor.execute(sql.SQL(select), [email])
        data = self.cursor.fetchone()
        userCount = data[0]
        dbPassword = data[1]
        public_id = data[2]

        if not userCount:
            return ('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm ="User does not exist !!"'})

        if check_password_hash(dbPassword, password):
            # generates the JWT Token
            token = jwt.encode({
                'public_id': public_id,
                'exp' : datetime.utcnow() + timedelta(minutes = 30)
            }, self.app.config['SECRET_KEY'])

            return (jsonify({'token' : token}), 201)
        # returns 403 if password is wrong
        return ('Could not verify', 403, {'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'})

    # signup route
    # @app.route('/api/signup', methods =['POST'])
    def signup(self, userName, email, password, admin, date):
        select = 'SELECT COUNT("username") as userCount, COUNT("email") as emailCount FROM users WHERE email=%s or username=%s;'
        self.cursor.execute(sql.SQL(select), [email, userName])
        data = self.cursor.fetchone()
        userNameCount = data[0]
        emailCount = data[1]
        if not userNameCount and not emailCount:
            publicId = str(uuid.uuid4())
            passwordHash = generate_password_hash(password)
            insert = 'INSERT INTO users ("username", "password", "admin", "email", "public_id", "dateOfBirth") VALUES (%s,%s,%s,%s,%s,%s)';
            self.cursor.execute(sql.SQL(insert), [userName, passwordHash, admin, email, publicId, date])
            self.connection.commit()
            return ('{"message": "Successfully registered."}', 201)
        else:
            return ('Username or email already exists.', 202)