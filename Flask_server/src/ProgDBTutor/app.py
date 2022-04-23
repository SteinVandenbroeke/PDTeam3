# TUTORIAL Len Feremans, Sandy Moens and Joey De Pauw
# see tutor https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972

# TUTORIAL geeksforgeeks
# see https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
import json

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

from User import User

from Dataset import Dataset

# INITIALIZE SINGLETON SERVICES
app = Flask('Tutorial ', static_url_path="/stop/", static_folder="react_build/")
app.config['SECRET_KEY'] = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
# database name
app.config['SQLALCHEMY_DATABASE_URI'] = config_data['uri']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

@app.route('/api/getCurrentUserInformation', methods =['GET'])
def getUserInformation():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    return make_response(*user.getUserInformationAsReturnRequest())

# User Database Route
# this route sends back list of users users
@app.route('/api/user', methods =['GET'])
def get_all_users_def():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    user = User(app)
    return user.get_all_users(current_user)

# route for logging user in
@app.route('/api/login', methods =['POST'])
def login_def():
    auth = request.form
    email = auth.get('email')
    password = auth.get('password')

    if not auth or not email or not password:
        # returns 401 if any email or / and password is missing
        return make_response(
            'Could not verify',
            401,
            {'WWW-Authenticate': 'Basic realm ="Login required !!"'}
        )
    user = User(app)
    returnValue = user.login(email, password)
    return make_response(*returnValue)

# signup route
@app.route('/api/signup', methods =['POST'])
def signup_def():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    data = request.form

    username = data['userName']
    email = data['email']
    password = data['password']
    date = data['dateOfBrith']
    firstName = data['firstName']
    lastName = data['lastName']
    profileImage = request.files["profileImage"]
    admin = False
    if 'adminPermision' in data and data['adminPermision'] == "on":
        admin = True

    returnValue = user.signup(username, email, password, admin, date,firstName, lastName, profileImage)
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/helloWorld')
def helloWorld():
    return "Hallo world"

@app.route('/api/uploadDataset', methods=['GET', 'POST'])
def uploadDataset():
    if request.method == 'POST':
        if 'interactionCsv' not in request.files or 'userCsv' not in request.files or 'itemCsv' not in request.files:
            flash('Geen bestand gevonden')
            return make_response('No file found.', 400)
        interactionCsv = request.files['interactionCsv']  # de gebruiker heeft een bestand geselecteerd
        userCsv = request.files['userCsv']  # de gebruiker heeft een bestand geselecteerd
        itemCsv = request.files['itemCsv']  # de gebruiker heeft een bestand geselecteerd

        if 'interactionConnections' not in request.form or 'usersConnections' not in request.form or 'itemConnections' not in request.form:
            flash('Geen correcte connecties')
            return make_response('No viable connections.', 400)
        interactionConnections = request.form.get('interactionConnections')
        usersConnections = request.form.get('usersConnections')
        itemConnections = request.form.get('itemConnections')

        if interactionCsv.filename == '' or userCsv.filename == '' or itemCsv.filename == '': # indien geen bestand geselecteerd
            flash('Geen bestand geselecteerd')
            return make_response('No file selected.', 400)

        datasetName = request.form.get('datasetName')
    userName = "Stein" #TODO
    dataset = Dataset()
    dataset.add(datasetName, userCsv, itemCsv, interactionCsv, usersConnections, itemConnections, interactionConnections, userName)
    return make_response('{"message": "File successfully uploaded."}', 201)

@app.route('/api/changeDataset', methods=['POST'])
def changeDataset():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset()
    returnValue = dataset.changeApiWrapper(request)
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getRecordById', methods=['GET'])
def getRecordById():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset()
    returnValue = dataset.getRecordById(request.args.get("dataSet"), request.args.get("table"), request.args.get("id"))
    return make_response(returnValue[0],returnValue[1])

# React interface, alle niet verwezen app.route's worden doorverwezen naar react interface in de react_build folder
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def reactApp(path):
    if not os.path.exists("react_build/" + path) or path == "":
        path = "index.html"

    return app.send_static_file(path)

@app.route('/api/getDatasets', methods=['GET'])
def getDatasets():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset()
    returnValue = dataset.getDatasets()
    return make_response(returnValue[0],returnValue[1])

@app.route('/api/getItemList', methods=['GET'])
def getItemList():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset()
    returnValue = dataset.getItemList(request.args.get("dataSet"), request.args.get("offset"))
    return make_response(returnValue[0],returnValue[1])

@app.route('/api/getPeopleList', methods=['GET'])
def getPeopleList():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset()
    returnValue = dataset.getPeopleList(request.args.get("dataSet"), request.args.get("offset"))
    return make_response(returnValue[0],returnValue[1])

@app.route('/api/getUsers', methods=['GET'])
def getUsers():
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    user = User(app)
    returnValue = user.getUsers()
    return make_response(returnValue[0],returnValue[1])

# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG, port=8000)
