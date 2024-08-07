from flask import Flask, render_template, request
from flask_socketio import SocketIO

from master import Master

# Initialize the flask app.
app = Flask(__name__)
socketio = SocketIO(app)
master = Master()

# Serve the index page.
@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

# Serve the game in solo mode.
@app.route('/solo', methods=['GET'])
def solo():
	return render_template('solo.html')

# Serve the game in duo mode.
@app.route('/duo', methods=['GET'])
def duo():
	return render_template('duo.html')

# Serve the score board tables.
@app.route('/scoreboard', methods=['GET'])
def scoreboard():
	return render_template('scoreboard.html', solo=master.getScores('solo'), duo=master.getScores('duo'))


# A client requests to play in duo mode.
@socketio.on('requestDuoGame')
def requestDuoGame(data):
	master.logMessage('requestDuoGame', request.sid)
	return master.requestDuoGame(request.sid)

# A client disconnects (closes windows, goes back, etc).
@socketio.on('disconnect')
def disconnect():
	master.logMessage('disconnect', request.sid)
	return master.disconnect(request.sid)

# A player sends an update of its complete arena.
@socketio.on('updateArena')
def updateArena(data):
	master.logMessage('updateArena', request.sid)
	return master.updateArena(request.sid, data)

# A player sends an update of the position of its falling piece.
@socketio.on('updatePiece')
def updatePiece(data):
	return master.updatePiece(request.sid, data)

# A player asks for the next batch of pieces.
@socketio.on('requestNextBatch')
def requestNextBatch(data):
	master.logMessage('requestNextBatch', request.sid)
	return master.requestNextBatch(request.sid)

# A player in duo mode wants to toggle the paused state.
@socketio.on('pause')
def pause(data):
	master.logMessage('pause', request.sid)
	return master.pause(request.sid)

# A player in duo mode notifies the other one that he has lost.
@socketio.on('lost')
def lost(data):
	master.logMessage('lost', request.sid)
	return master.lost(request.sid, data)

# A player in duo mode has decided to start over.
@socketio.on('startedAgain')
def startedAgain(data):
	master.logMessage('startedAgain', request.sid)
	return master.startedAgain(request.sid)

# A player updates the selection of a selector box.
@socketio.on('updateSelector')
def updateSelector(data):
	master.logMessage('updateSelector', request.sid)
	return master.updateSelector(request.sid, data)

# A player updates the state.
@socketio.on('updateState')
def updateState(data):
	master.logMessage('updateState', request.sid)
	return master.updateState(request.sid, data)

# A player updates their input box.
@socketio.on('updateInputBox')
def updateInputBox(data):
	master.logMessage('updateInputBox', request.sid)
	return master.updateInputBox(request.sid, data)

# A player has submitted a high score.
@socketio.on('submit')
def submit(data):
	master.logMessage('submit', request.sid)
	return master.submit(request.sid, data)

# Run the app with web sockets capabilities.
if __name__ == '__main__':
	app.debug = True
	socketio.run(app, host='0.0.0.0', port=8080)
