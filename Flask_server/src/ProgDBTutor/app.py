# TUTORIAL Len Feremans, Sandy Moens and Joey De Pauw
# see tutor https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972

# TUTORIAL geeksforgeeks
# see https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
from flask import Flask, request, jsonify, make_response, session, flash, redirect, url_for
from flask.templating import render_template

import uuid # for public id

from sqlalchemy.sql.functions import current_user
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

from Dataset import Dataset



# INITIALIZE SINGLETON SERVICES
app = Flask('Tutorial ', static_url_path="/stop/", static_folder="react_build/")
app.config['SECRET_KEY'] = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
# database name
app.config['SQLALCHEMY_DATABASE_URI'] = config_data['uri']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
# creates SQLALCHEMY object
db = SQLAlchemy(app)

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

from User import User

user = User(db)

# decorator for verifying the JWT
def token_required_def(f):
    return user.token_required(f)


# User Database Route
# this route sends back list of users users
@app.route('/api/user', methods =['GET'])
@token_required_def
def get_all_users_def():
    return user.get_all_users(current_user)


# route for logging user in
@app.route('/api/login', methods =['POST'])
def login_def():
    return user.login()


# signup route
@app.route('/api/signup', methods =['POST'])
def signup_def():
    return user.signup()



@app.route('/api/helloWorld')
def helloWorld():
    return "Hallo world"


uploadsFolder = '/uploads'
goodExtensions = {'txt', 'json'}
appl = Flask(__name__)
appl.config['UPLOAD_FOLDER'] = uploadsFolder
appl.config['MAX_CONTENT_LENGTH'] = 5000000  # max input bestanden van 5 MB

# inspiratie gehaald voor deze code van https://flask.palletsprojects.com/
def checkExtension(bestand):
    return '.' in bestand and \
           bestand.rsplit('.', 1)[1].lower() in goodExtensions

'''
        <!doctype html>
        <title>Upload nieuw Bestand</title>
        <h1>Upload nieuw Bestand</h1>
        <form method=post enctype=multipart/form-data>
          <input type=file name=bestand>
          <input type=submit value=Upload>
        </form>
        '''
@app.route('/api/upload', methods=['GET', 'POST'])
def uploadFile():
    if request.method == 'POST':
        if 'bestand' not in request.files:
            flash('Geen bestand gevonden')
            return make_response('No file found.', 400)

        bestand = request.files['bestand']  # de gebruiker heeft een bestand geselecteerd

        if bestand.filename == '': # indien geen bestand geselecteerd
            flash('Geen bestand geselecteerd')
            return make_response('No file selected.', 400)

        #if bestand and checkExtension(bestand.filename):
        if bestand:
            filename = secure_filename(bestand.filename) # secure filename om foutieve userInput tegen te gaan
            #filename = "testtt.txt"
            #bestand.save(os.path.join(appl.config['UPLOAD_FOLDER'], filename))
            #return redirect(url_for('download_file', name=filename))
            print(os.path.join('/uploads', filename))

            bestand.save(os.path.join('uploads', filename))


            return make_response('File successfully uploaded.', 201)
    return

@app.route('/api/uploadDataset', methods=['GET', 'POST'])
def uploadDataset():
    if request.method == 'POST':
        if 'interactionCsv' not in request.files or 'userCsv' not in request.files or 'itemCsv' not in request.files:
            flash('Geen bestand gevonden')
            return make_response('No file found.', 400)
        interactionCsv = request.files['interactionCsv']  # de gebruiker heeft een bestand geselecteerd
        userCsv = request.files['userCsv']  # de gebruiker heeft een bestand geselecteerd
        itemCsv = request.files['interactionCsv']  # de gebruiker heeft een bestand geselecteerd

        if 'interactionConnections' not in request.form or 'usersConnections' not in request.form or 'itemConnections' not in request.form:
            flash('Geen correcte connecties')
            return make_response('No viable connections.', 400)
        interactionConnections = request.form.get('interactionConnections')
        usersConnections = request.form.get('usersConnections')
        itemConnections = request.form.get('itemConnections')

        if interactionCsv.filename == '' or userCsv.filename == '' or itemCsv.filename == '': # indien geen bestand geselecteerd
            flash('Geen bestand geselecteerd')
            return make_response('No file selected.', 400)
    dataset = Dataset()
    dataset.add(userCsv, itemCsv, interactionCsv, usersConnections, itemConnections, interactionConnections)
    return make_response('File successfully uploaded.', 201)


# React interface, alle niet verwezen app.route's worden doorverwezen naar react interface in de react_build folder
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def reactApp(path):
    if not os.path.exists("react_build/" + path) or path == "":
        path = "index.html"

    return app.send_static_file(path)


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG, port=8000)
