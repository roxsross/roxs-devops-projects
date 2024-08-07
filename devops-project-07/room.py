from random import random
from math import floor
from flask_socketio import join_room, emit

class Room:
	possiblePieces = ['T', 'J', 'Z', 'O', 'S', 'L', 'I']

	def __init__(self, name):
		self.name = name

		# Store the socket ids of the clients playing in this room.
		self.ids = {1: None, 2: None}

		# List of the pieces both players play with.
		self.pieces = []

		# Position of the next piece to give to each player.
		self.position = {1: 0, 2: 0}

	# Join a client to this room.
	def join(self, socketId):
		player = None
		if self.ids[1] == None:
			self.ids[1] = socketId
			player = 1
		elif self.ids[2] == None:
			self.ids[2] = socketId
			player = 2
		else:
			print('ERROR: cannot join client to room {}. The room is full'.format(self.name))
			return False

		# Join this socket id to the web sockets room.
		join_room(self.name)
		print('Client {} accepted in room {}'.format(socketId, self.name))

		# Tell the user to wait or tell both to begin new game.
		if player == 1:
			print('Room not full, sending wait message')
			emit('waitingForAnotherPlayer', {}, room=socketId)
		elif player == 2:
			print('Room full, sending begin message')
			self.beginDuoGame()

	# A player in this room has disconnected. Empty the room.
	def disconnect(self):
		# Notify both players.
		emit('endDuoGame', {}, room=self.name)

		# Remove socket ids, reset the piece list and the position counters.
		self.ids[1] = None
		self.ids[2] = None
		self.pieces = []
		self.position[1] = 0
		self.position[2] = 0

		print('Disconnected both players in room {}. Room is currently empty'.format(self.name))

	# Returns the number of players currently in the room.
	def numPlayers(self):
		if self.ids[1] == None:
			return 0
		elif self.ids[2] == None:
			return 1
		else:
			return 2

	# Returns the player number from a socket id.
	def getPlayerNumber(self, socketId):
		if self.ids[1] == socketId:
			return 1
		elif self.ids[2] == socketId:
			return 2
		else:
			return None

	# Returns the socket id of the adversary.
	def getAdversarySocketId(self, socketId):
		if self.ids[1] == socketId:
			return self.ids[2]
		elif self.ids[2] == socketId:
			return self.ids[1]
		else:
			return None

	# Decides if the socket id is a player in this room.
	def inRoom(self, socketId):
		return self.ids[1] == socketId or self.ids[2] == socketId

	# Logs the pieces in this room to the terminal.
	def logPieces(self):
		print('Current pieces in room {}:'.format(self.name))
		print(self.pieces)

	# Starts the duo game.
	def beginDuoGame(self):
		# Create the first ten pieces and pack them.
		self.pieces = []
		for i in range(10):
			self.pieces.append(self.possiblePieces[floor(random() * len(self.possiblePieces))])
		firstPieces = {'pieces': self.pieces}
		self.logPieces()

		# Initialize the counter for both players.
		self.position[1] = 10
		self.position[2] = 10

		emit('beginDuoGame', firstPieces, room=self.name)

	# Appends the requested number of pieces to the list in this room.
	def createNewPieces(self, numPieces):
		for i in range(numPieces):
			self.pieces.append(self.possiblePieces[floor(random() * len(self.possiblePieces))])
		self.logPieces()

	# Bounce a message to the other player in this room.
	def bounce(self, socketId, message, data):
		adversarySocketId = self.getAdversarySocketId(socketId)
		if adversarySocketId == None:
			print('ERROR: cannot bounce message')
			return False

		emit(message, data, room=adversarySocketId)
		return True

	# Handles the request of a next batch from a socket id of this room.
	def requestNextBatch(self, socketId):
		# Get the player number of this socket id.
		player = self.getPlayerNumber(socketId)
		if player == None:
			print('ERROR: cannot handle next batch request. Player unknown')
			return False

		# If I do not have the ten next pieces ready, create as many as needed.
		if self.position[player] + 10 > len(self.pieces):
			self.createNewPieces(self.position[player] + 10 - len(self.pieces))
			for i in range(len(self.pieces) - 1, self.position[player] + 10):
				self.pieces.append(self.possiblePieces[floor(random() * len(self.possiblePieces))])

		# Pack the next ten pieces.
		nextBatch = {'pieces': []}
		for i in range(10):
			nextBatch['pieces'].append(self.pieces[self.position[player] + i])

		# Update the counter of this player.
		self.position[player] += 10

		# Send the batch to the player that requested it.
		emit('nextBatch', nextBatch, room=socketId)
		return True

	# A player in this room has started again.
	def startedAgain(self, socketId):
		# Bounce the message back to the other player in the room.
		self.bounce(socketId, 'startedAgain', {})

		# Reset the piece position of this player.
		self.position[self.getPlayerNumber(socketId)] = 10
