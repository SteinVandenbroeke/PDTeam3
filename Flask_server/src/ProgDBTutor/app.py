# TUTORIAL Len Feremans, Sandy Moens and Joey De Pauw
# see tutor https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972
from flask import Flask
from flask.templating import render_template
from flask import request, session, jsonify

from config import config_data
from quote_data_access import Quote, DBConnection, QuoteDataAccess

# INITIALIZE SINGLETON SERVICES
app = Flask('Tutorial ', static_url_path="/", static_folder="react_build/")
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


# React interface, alle niet verwezen app.route's worden doorverwezen naar react interface in de react_build folder
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def reactApp(path):
    if path == "":
        path = "index.html"
    return app.send_static_file(path)


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
