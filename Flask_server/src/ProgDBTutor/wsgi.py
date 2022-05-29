from app import app
#from app import socketio

if __name__ == "__main__":
    socketio.run(app, debug=True, cors_allowed_origins="http://team3.ua-ppdb.me")
    #app.run()
