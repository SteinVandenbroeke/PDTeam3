# TUTORIAL Len Feremans, Sandy Moens and Joey De Pauw
# see tutor https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972

# TUTORIAL geeksforgeeks
# see https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
import json
from threading import Thread

from flask import Flask, request, jsonify, make_response, session, flash, redirect, url_for, abort
from flask.templating import render_template
import uuid # for public id

from sqlalchemy.sql.functions import current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess
import os

# imports for PyJWT authentication
import jwt
from datetime import datetime, timedelta
from functools import wraps

from User import User

from Dataset import Dataset
from ABTest import *
from flask_socketio import SocketIO, send, emit

# INITIALIZE SINGLETON SERVICES
app = Flask('Tutorial ', static_url_path="/stop/", static_folder="react_build/")
app.config['SECRET_KEY'] = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
# database name
app.config['SQLALCHEMY_DATABASE_URI'] = config_data['uri']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

socketio = SocketIO(app)

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

@app.route('/api/getCurrentUserInformation', methods =['GET'])
def getUserInformation():
    """
    Admin privileges: Not needed
    Get user information of loggdin user
    @return: json of user information
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    return make_response(*user.getUserInformationAsReturnRequest())

# User Database Route
# this route sends back list of users users
@app.route('/api/user', methods =['GET'])
def get_all_users_def():
    """
    Admin privileges: Needed
    Returns a list of all users
    @return:
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    user = User(app)
    return user.get_all_users(current_user)

# route for logging user in
@app.route('/api/login', methods =['POST'])
def login_def():
    """
    Admin privileges: Not needed
    User login
    @return: auth token
    """
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

@app.route('/api/signup', methods =['POST'])
def signup_def():
    """
    Admin privileges: Needed
    Creates a new user
    @return: auth token
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    data = request.form

    username = data.get('userName')
    email = data.get('email')
    password = data.get('password')
    date = data.get('dateOfBrith')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    profileImage = request.files.get("profileImage")
    admin = False
    if 'adminPermision' in data and data['adminPermision'] == "on":
        admin = True

    returnValue = user.signup(username, email, password, admin, date,firstName, lastName, profileImage)
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/helloWorld')
def helloWorld():
    """
    Admin privileges: Not needed
    To easly test the server
    @return:
    """
    return "Hallo world"

@app.route('/api/uploadDataset', methods=['GET', 'POST'])
def uploadDataset():
    """
    Admin privileges: Needed
    Create a new dataset, with post request containing the csv and connection data
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

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
        usersConnections = request.form.get('usersConnections')
        itemConnections = request.form.get('itemConnections')

        if interactionCsv.filename == '' or userCsv.filename == '' or itemCsv.filename == '': # indien geen bestand geselecteerd
            flash('Geen bestand geselecteerd')
            return make_response('No file selected.', 400)

        datasetName = request.form.get('datasetName')
    userName = user.username
    dataset = Dataset(datasetName)
    dataset.add(userCsv, itemCsv, interactionCsv, usersConnections, itemConnections, interactionConnections, userName)

    return make_response('{"message": "File successfully uploaded."}', 201)

@app.route('/api/createAbTest', methods=['GET', 'POST'])
def createAbTest():
    """
    Admin privileges: Not needed
    Creates a A/B Test in another thread so the user can leave te page
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    period = json.loads(request.form.get("periodValues"))
    algorithms = json.loads(request.form.get("algorithms"))
    abtest = ABTest()
    abtest.initialize(request.form.get("abTestName"), algorithms,request.form.get("dataSetId"), period[0], period[1], request.form.get("stepSizeValue"), request.form.get("topKValues"), user.username)

    thread = Thread(target=abtest.create, kwargs={'loadingSocket': socketio})
    thread.start()

    return make_response('{"message": "ABTest word aangemaakt, u kan de pagina verlaten."}', 201)

@app.route('/api/ABTestOverview', methods=['GET', 'POST'])
def overviewPageABTest():
    """
    Admin privileges: Not needed
    Only for owner of AB Test
    @return: the overview information of the A/B Test
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    abtest = ABTest(request.args.get("abTestName"), user.username)
    overviewPageData = abtest.overviewPageData()

    return make_response(overviewPageData[0], overviewPageData[1])

@app.route('/api/totalActiveUserAmount', methods=['GET', 'POST'])
def totalActiveUserAmount():
    """
    Admin privileges: Not needed
    Only for owner of AB Test
    @return: the total active user amount in a certain period (Get: startDate and endDate) for a A/B Test
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('User token wrong or missing', 401)

    abtest = ABTest(request.args.get("abTestName"), user.username)
    overviewPageData = abtest.getTotalActiveUsers(request.args.get("startDate"), request.args.get("endDate"))
    return make_response(overviewPageData[0], overviewPageData[1])

@app.route('/api/changeDataset', methods=['POST'])
def changeDataset():
    """
    Admin privileges: Needed
    Updates a record of a A/B test
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    dataset = Dataset(request.form.get("dataSet"))
    returnValue = dataset.changeApiWrapper(request)
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getRecordById', methods=['GET'])
def getRecordById():
    """
    Admin privileges: Not Needed
    Returns a record of a dataset
    @return: record information as json
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset(request.args.get("dataSet"))
    returnValue = dataset.getRecordById(request.args.get("table"), request.args.get("id"))
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getDatasets', methods=['GET'])
def getDatasets():
    """
    Admin privileges: Not Needed
    returns a list of datasets
    @return: json list of datasets
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset()
    returnValue = dataset.getDatasets()
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/deleteABTest', methods=['GET'])
def deleteABTest():
    """
    Admin privileges: Not Needed
    Only for owner of AB Test
    deletes a A/B test
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    abtest = ABTest(request.args.get("abTestName"), user.username)
    returnValue = abtest.delete()
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/deleteDataset', methods=['GET'])
def deleteDataset():
    """
    Admin privileges: Needed
    delete a dataset
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    dataset = Dataset(request.args.get("dataSet"))
    returnValue = dataset.deleteDataset()
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/deletePerson', methods=['GET'])
def deletePerson():
    """
    Admin privileges: Needed
    Deletes a person from a dataset by it's id given in get: personId (id of person) and setId (id of dataset)
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    dataset = Dataset(request.args.get("setId"))
    returnValue = dataset.deletePerson(request.args.get("personId"))
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/deleteItem', methods=['GET'])
def deleteItem():
    """
    Admin privileges: Needed
    Deletes a item from a dataset by it's id given in get: itemId (id of item) and setId (id of dataset)
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    dataset = Dataset(request.args.get("setId"))
    returnValue = dataset.deleteItem(request.args.get("itemId"))
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getItemList', methods=['GET'])
def getItemList():
    """
    Admin privileges: Not needed
    Return a item list of a dataset with the id given in a get: dataSet
    @return: json list of items
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset(request.args.get("dataSet"))
    returnValue = dataset.getItemList(request.args.get("offset"))
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getPeopleList', methods=['GET'])
def getPeopleList():
    """
    Admin privileges: Not needed
    Returns a peaple list of a dataset with the id given in a get: dataSet
    @return: json list of peaple
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset(request.args.get("dataSet"))
    returnValue = dataset.getPeopleList(request.args.get("offset"))
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getDatasetAmounts', methods=['GET'])
def getDatasetAmounts():
    """
    Admin privileges: Not needed
    Returns the "customerAmount", "itemAmount", "purchaseAmount" of a dataset
    @return: json list of the amounts
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    dataset = Dataset(request.args.get("dataSet"))
    returnValue = dataset.getAmounts()
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getABtests', methods=['GET'])
def getABtests():
    """
    Admin privileges: Not Needed
    Only for owner of AB Test
    Returns all AB test for current logged in user
    @return: list of AB tests
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    abtest = ABTest(None, user.username)
    returnValue = abtest.getABtests()
    return make_response(returnValue[0],returnValue[1])

@app.route('/api/getPurchases', methods=['GET'])
def getPurchases():
    """
    Admin privileges: Not Needed
    Returns a list of all purches in a dataset
    @return: json purches list
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset(request.args.get("dataSet"))
    returnValue = dataset.getPurchases(request.args.get("id"))
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getTimeStampList', methods=['GET'])
def getTimeStampList():
    """
    Admin privileges: Not Needed
    Returns a list of all timeStamps in a dataset (from start data to end date of purcheses)
    @return: json list of timeStamps
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset(request.args.get("id"))
    returnValue = dataset.getTimeStampList(json)
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getArticleCount', methods=['GET'])
def getArticleCount():
    """
    Admin privileges: Not Needed
    Returns the count of all aricles in a dataset
    @return: json int
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset(request.args.get("id"))
    returnValue = dataset.getArticleCount()
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getCustomerCount', methods=['GET'])
def getCustomerCount():
    """
    Admin privileges: Not Needed
    Returns the count of all customers in a dataset
    @return: json int
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    dataset = Dataset(request.args.get("id"))
    returnValue = dataset.getCustomerCount()
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/getUsers', methods=['GET'])
def getUsers():
    """
    Admin privileges: Needed
    Returns all user account
    @return: json list of users
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    user = User(app)
    returnValue = user.getUsers()
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/changeAdminPermission', methods=['GET'])
def changeAdminPermission():
    """
    Admin privileges: Needed
    Change the permission of a user account
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    if user.username == request.args.get("userName"):
        return make_response('{"message": Cannot change user u are logged in with."}', 500)
    returnValue = user.changeAdminPermission(request.args.get("userName"), request.args.get("permission"))
    return make_response(returnValue[0], returnValue[1])

@app.route('/api/deleteUser', methods=['GET'])
def deleteUser():
    """
    Admin privileges: Needed
    Deletes a user account
    @return: succes/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    elif not user.admin:
        return make_response('you must be admin to perform this action', 500)

    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    if user.username == request.args.get("userName"):
        return make_response('{"message": Cannot delete user u are logged in with."}', 500)
    returnValue = user.deleteUser(request.args.get("userName"))
    return make_response(returnValue[0],returnValue[1])

@app.route('/api/getUsersFromABTest', methods=['GET'])
def getUsersFromABTest():
    """
    Admin privileges: Not Needed
    Only for owner of AB Test
    Returns persons information in AB Test like CTR, Total clicks,...
    @return: list of person information
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    abtest = ABTest(request.args.get("abTestId"),user.username)
    returnValue = abtest.getUsersFromABTest(request.args.get("startDate"), request.args.get("endDate"))
    return make_response(returnValue[0], returnValue[1])


@app.route('/api/getItemsFromABTest', methods=['GET'])
def getItemsFromABTest():
    """
    Admin privileges: Not Needed
    Only for owner of AB Test
    Returns item information in AB Test like CTR, Total clicks,...
    @return: list of items information
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    abtest = ABTest(request.args.get("abTestId"),user.username)
    returnValue = abtest.getItemsFromABTest(request.args.get("startDate"), request.args.get("endDate"))
    return make_response(returnValue[0], returnValue[1])


@app.route('/api/getDatasetIdFromABTest', methods=['GET'])
def getDatasetIdFromABTest():
    """
    Admin privileges: Not Needed
    Returns the dataset id for a certain AB test with id given in Get: abTestId
    @return: json int
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    abtest = ABTest(request.args.get("abTestId"), user.username)
    returnValue = abtest.getDatasetIdFromABTest()
    return make_response(returnValue[0], returnValue[1])


@app.route('/api/getPendingAbTests', methods=['GET'])
def getPendingAbTests():
    """
    Admin privileges: Not Needed
    Returns a list of all pending or broken AB tests
    @return: json int
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)
    abtest = ABTest(None, user.username)
    returnValue = abtest.getAllPendingOrBrokenAbTests()
    return make_response(returnValue[0], returnValue[1])


@app.route('/api/resetAbTests', methods=['GET'])
def resetAbTests():
    """
    Admin privileges: Not Needed
    Function to reset an AB Test with id: Get (abTestName)
    @return: success/fail message
    """
    user = User(app)
    back = user.checkTokenAndLoadData(request)
    if not back:
        return make_response('{"message": "User token wrong or missing"}', 401)

    abtest = ABTest(request.args.get("abTestName"), user.username)
    thread = Thread(target=abtest.reset, kwargs={'loadingSocket': socketio})
    thread.start()

    return make_response('{"message": "ABTest word gereset, u kan de pagina verlaten."}', 201)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def reactApp(path):
    """
    the react application.
    returns the html, js, css, ... files
    @param path: path of item
    @return:
    """
    if not os.path.exists("react_build/" + path) or path == "":
        path = "index.html"

    return app.send_static_file(path)

# RUN DEV SERVER
if __name__ == "__main__":
    # app.run(HOST, debug=DEBUG, port=8000)
    socketio.run(app,  debug=DEBUG, port=8000)
