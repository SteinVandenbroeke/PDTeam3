# TUTORIAL Len Feremans, Sandy Moens and Joey De Pauw
# see tutor https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972
from flask import Flask
from flask.templating import render_template
from flask import request, session, jsonify, flash, redirect, url_for

from werkzeug.utils import secure_filename

from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess
import os

# INITIALIZE SINGLETON SERVICES
app = Flask('Tutorial ', static_url_path="/stop/", static_folder="react_build/")
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']
connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'])
quote_data_access = QuoteDataAccess(connection)

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"


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
    if request.method is 'POST':
        if 'bestand' not in request.files:
            flash('Geen bestand gevonden')
            return redirect(request.url)

        bestand = request.files['bestand'] # de gebruiker heeft een bestand geselecteerd

        if bestand.filename == '': # indien geen bestand geselecteerd
            flash('Geen bestand geselecteerd')
            return redirect(request.url)
        if bestand and checkExtension(bestand.filename):
            filename = secure_filename(bestand.filename) # secure filename om foutieve userInput tegen te gaan
            bestand.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('download_file', name=filename))
    return


# React interface, alle niet verwezen app.route's worden doorverwezen naar react interface in de react_build folder
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def reactApp(path):
    if not os.path.exists("react_build/" + path) or path == "":
        path = "index.html"

    return app.send_static_file(path)


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
