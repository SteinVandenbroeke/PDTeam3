# see https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
from flask import Flask, request, jsonify, make_response, session, flash, redirect, url_for
from flask.templating import render_template
import json
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
        self.username = None
        self.admin = False
        self.email = None
        self.dateOfBirth = None
        self.profilePicture = None
        self.firstName = None
        self.lastName = None
        self.isLoggedIn = False

    def getUserInformationAsReturnRequest(self):
        return (jsonify({'loggedIn': self.isLoggedIn,
                         'username': self.username,
                         'admin': self.admin,
                         'email': self.email,
                         "dateOfBirth": self.dateOfBirth,
                         "profilePicture": self.profilePicture,
                         "firstName": self.firstName,
                         "lastName": self.lastName}), 201)

    # decorator for verifying the JWT
    def checkTokenAndLoadData(self, request):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        # return 401 if token is not passed
        if not token:
            print("no token")
            return False
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, self.app.config['SECRET_KEY'], algorithms=['HS256'])
            select = 'SELECT users.email, users.public_id, users."profilePicture", users."admin", users."username", users."dateOfBirth", users."firstName", users."lastName"  FROM users WHERE public_id=%s;'
            self.cursor.execute(sql.SQL(select), [data['public_id']])
            userData = self.cursor.fetchone()
            self.email = userData[0]
            self.profilePicture = userData[2]
            self.admin = userData[3]
            self.username = userData[4]
            self.dateOfBirth =userData[5]
            self.firstName = userData[6]
            self.lastName = userData[7]
            return True
        except:
            print("invalid token")
            return False

    def getUsers(self):
        self.cursor.execute(sql.SQL('SELECT * FROM "users"'))
        data = self.cursor.fetchall()
        returnList = []
        for row in data:
            item = [row[0],row[7],row[8], row[4].strftime("%m/%d/%Y"),row[2]]
            returnList.append(item)
        return (json.dumps(returnList), 200)

    def deleteUser(self, userName):
        try:
            self.cursor.execute(sql.SQL('DELETE FROM users WHERE username=%s'), [userName])
            self.connection.commit()
        except:
            self.connection.close()
            return ('{"message":"User could not be deleted."}', 500)
        self.connection.close()
        return ('{"message":"User deleted succesfully."}', 201)




    # route for logging user in
    # @app.route('/api/login', methods =['POST'])
    def login(self, email, password):
        select = 'SELECT users.email, users.password, users.public_id, users."profilePicture", users."admin"  FROM users WHERE email=%s;'
        self.cursor.execute(sql.SQL(select), [email])
        data = self.cursor.fetchone()
        userCount = data[0]
        dbPassword = data[1]
        public_id = data[2]
        profileImage = data[3]
        isAdmin = data[4]

        if not userCount:
            return ('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm ="User does not exist !!"'})

        if check_password_hash(dbPassword, password):
            # generates the JWT Token
            token = jwt.encode({
                'public_id': public_id,
                'exp' : datetime.utcnow() + timedelta(minutes = 240)
            }, self.app.config['SECRET_KEY'])

            return (jsonify({'token' : token, 'admin': isAdmin}), 201)
        # returns 403 if password is wrong
        return ('Could not verify', 403, {'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'})

    def uploadProfileImage(self, file, name):
        try:
            if file.filename.split('.')[1] == "jpg" or file.filename.split('.')[1] == "png" or file.filename.split('.')[1] == "JPG" or file.filename.split('.')[1] == "jpeg":
                file.save("react_build/profileImages/" + name + "." + file.filename.split('.')[1])
            else:
                print("wrong image format")
        except:
            print("no profile image")


    # signup route
    # @app.route('/api/signup', methods =['POST'])
    def signup(self, userName, email, password, admin, date, firstName, lastName, profileImage):
        select = 'SELECT COUNT("username") as userCount, COUNT("email") as emailCount FROM users WHERE email=%s or username=%s;'
        self.cursor.execute(sql.SQL(select), [email, userName])
        data = self.cursor.fetchone()
        userNameCount = data[0]
        emailCount = data[1]
        if not userNameCount and not emailCount:
            publicId = str(uuid.uuid4())
            passwordHash = generate_password_hash(password)
            insert = 'INSERT INTO users ("username", "password", "admin", "email", "public_id", "dateOfBirth", "firstName", "lastName", "profilePicture") VALUES (%s,%s,%s,%s,%s,%s, %s, %s, %s)';
            self.cursor.execute(sql.SQL(insert), [userName, passwordHash, admin, email, publicId, date,firstName,lastName, userName + "." + profileImage.filename.split('.')[1] ])
            self.connection.commit()
            self.uploadProfileImage(profileImage, userName)
            return ('{"message": "Successfully registered."}', 201)
        else:
            return ('Username or email already exists.', 202)