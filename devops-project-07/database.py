import os
from sqlite3 import Error, connect

class Database:
	def __init__(self):
		self.filename = os.environ['DB_FILENAME']

	# Initializes the database.
	def initialize(self):
		if not self.initialized():
			print('Initializing database')
			query = """CREATE TABLE solo (
					'username' VARCHAR(45) NOT NULL DEFAULT '',
					'high' INT unsigned DEFAULT NULL,
					PRIMARY KEY ('username'));"""
			self.executeQuery(query)
			query = """CREATE TABLE duo (
				'username' VARCHAR(45) NOT NULL DEFAULT '',
				'high' INT UNSIGNED DEFAULT NULL,
				PRIMARY KEY ('username'));"""
			self.executeQuery(query)
		else:
			print('Database already initialized')
		return True

	# Decides if the database is initalized already.
	def initialized(self):
		resultSolo = self.executeQuery('SELECT name FROM sqlite_master WHERE type="table" AND name="solo";')
		resultDuo = self.executeQuery('SELECT name FROM sqlite_master WHERE type="table" AND name="duo";')
		if resultSolo != None and len(list(resultSolo)) == 1 and resultDuo != None and len(list(resultDuo)) == 1:
			return True
		else:
			return False

	# Executes a query into the database.
	def executeQuery(self, query, tuple=()):
		# Open a connection to the database.
		try:
			connection = connect(self.filename)
		except Error as error:
			print('DATABASE ERROR: could not open a connection to the database')
			print(Error)
			return None

		# Execute the query.
		try:
			cursor = connection.cursor()
			cursor.execute(query, tuple)
			result = cursor.fetchall()
		except Error as error:
			print('DATABASE ERROR: could not execute the query')
			print(Error)
			return None

		# Commit the changes and close the connection.
		try:
			connection.commit()
			connection.close()
		except Error as error:
			print('DATABASE ERROR: could not close connection to the database')
			print(Error)
			return None

		return result

	# Prints the current status of the database.
	def printStatus(self):
		resultSolo = self.executeQuery("SELECT * FROM solo;")
		resultDuo = self.executeQuery("SELECT * FROM duo;")
		if resultSolo == None or resultDuo == None:
			return False

		print('DATABASE STATUS:')
		print('Table solo:')
		for row in resultSolo:
			print(row)
		print('Table duo:')
		for row in resultDuo:
			print(row)

	# Get the current high score for the username and mode provided.
	def getHighScore(self, username, mode):
		# Execute query to the database.
		if mode == 'solo':
			query = "SELECT * FROM solo WHERE username=?;"
		elif mode == 'duo':
			query = "SELECT * FROM duo WHERE username=?;"
		result = self.executeQuery(query, (username,))

		# Check if the result obtained is valid.
		if result == None:
			print('DATABASE ERROR: could not query current high score of username {}, mode {}'.format(username, mode))
			return None

		# This username is not in the database.
		if len(list(result)) == 0:
			return None
		else:
			print(result)
			return result[0][1]

	# Function called when a username wants to submit a high score.
	def submitHighScore(self, username, mode, score):
		# Check that the arguments are valid.
		if not (type(username) is str and type(mode) is str and type(score) is int):
			print('DATABASE ERROR: invalid arguments to insert high score')
			return False

		# Query the high score in the database.
		currentScore = self.getHighScore(username, mode)

		# If user does not exist in database, create a new row.
		if currentScore == None:
			if mode == 'solo':
				query = """INSERT INTO solo (username, high)
						VALUES (?, ?);"""
			elif mode == 'duo':
				query = """INSERT INTO duo (username, high)
						VALUES (?, ?);"""

			result = self.executeQuery(query, (username, score,))
			self.printStatus()

			return True

		# We have a high score for this user, check if he has obtained a higher score this time.
		if score > currentScore:
			if mode == 'solo':
				query = 'UPDATE solo SET high=? WHERE username=?;'
			elif mode == 'duo':
				query = 'UPDATE duo SET high=? WHERE username=?;'

			self.executeQuery(query, (score, username,))
			self.printStatus()
			return True

		# New high score is not higher than the previous one.
		self.printStatus()
		return True

	# Returns the requested scores of the selected mode.
	def getScores(self, mode):
		query = "SELECT * FROM " + mode + " ORDER BY high DESC;"
		result = self.executeQuery(query)

		if result == None:
			print('DATABASE: cannot send back the scores')
			print(Error)

		return result
