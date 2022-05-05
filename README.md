# README #
Server and front-end for project DB Team 3

## Server ##
We use a Flask server

### Run flask server: ###
1) Setting up the environment (same as tutorial)
   - cd Flask_server
   - virtualenv -p python3 env (only fist time)
   - source env/bin/activate
   - pip3 install -r requirements.txt (only fist time)
   
2) Start the test server
   -cd src/ProgDBTutor/
   -python app.py
   
### How to use ###
1) open Flask_server\src\ProgDBTutor in Pycharm
2) App.py contains all api url's like "/api/helloWorld" when you http://localhost:5000/api/helloWorld you will get Hello world because the function helloWorld() returns the string "Hello world" we will use this the return json information
3) the folder "react_build" contains the builded version of the react front end, all url's that are not app.route() will redirect to this folder

## Front end ##
We use react
!!! Don't upload node_modules to github !!!

### Install react package for react project ###
1) open "React_front_end" in terminal
2) Run in the terminal npm install

### Run a react dev server ###
Can be used to design the front end
1) open "React_front_end" in Webstorm
2) Run in the terminal npm start

### Build the react front end ###
the build will automatically copy itself to the flask server in the folder "react_build"
1) run following command in the "React_front_end" folder: npm run build
2) Test if react is corectly build with the python flask server

## Code ##

### Flask server ###
```src/ProgDBTutor/app.py```
change port and redirections

### React frontend ###
```src/pages``` style for different pages

## config.py ##
config_data = dict()  
config_data['app_name'] = 'appname' (ProgDB Tutor)  
config_data['dbname'] = 'dbname' (dbtutor)  
config_data['dbuser'] = 'user' (app)  
config_data['uri'] = 'postgresql://username:password@localhost:5432/dbname'  

## database ##

### create user: ###
```create user postgrespython with encrypted password 'dbAdmin';```

### create database ###
```CREATE DATABASE avsaDB OWNER postgresPython;```

### create connection with database to datagrip ###
add > data source > postgreSQL >  
gegevens:
name = avsadb 
host = localhost
user = postgrespython
password = dbAdmin
database = avsadb
port = 5433 or default
-> test connection

### import datascheme ###
right click public > Run SQL script... > Select schemaInitialization.sql

## Upload to google cloud ##
ga naar de app user:
```sudo su app```

git pull:
```git pull```

ga naar eigen user:
```exit```

Restart webapp:
```sudo systemctl restart webapp```