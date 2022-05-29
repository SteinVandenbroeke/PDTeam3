from app import app
#from app import socketio

if __name__ == "__main__":
    socketio.run(app, cors_allowed_origins="*")
    #app.run()
