/* Define the possible movements of the piece. */
const DIR_DOWN = 'down';
const DIR_RIGHT = 'right';
const DIR_LEFT = 'left';

/* Define the two possible rotation directions. */
const ROTATION_DIR_LEFT = 'rot_left';
const ROTATION_DIR_RIGHT = 'rot_right';

/* Define the modes of play. */
const MODE_SOLO = 'solo';
const MODE_DUO = 'duo';

/* Number of lines cleared and corresponding points at level zero. */
const POINTS_LEVEL_ZERO = {
	0: 0,
	1: 40,
	2: 100,
	3: 300,
	4: 1200
};

/* Number of frames the piece stays in place, before moving down,
as a function of the level. */
const FRAMES = {
	0: 48,
	1: 43,
	2: 38,
	3: 33,
	4: 28,
	5: 23,
	6: 18,
	7: 13,
	8: 8,
	9: 6,
	10: 5,
	11: 5,
	12: 5,
	13: 4,
	14: 4,
	15: 4,
	16: 3,
	17: 3,
	18: 3,
	19: 2,
	29: 1
};

/* Number of frames for the piece, while in soft drop. */
const FRAMES_SOFT_DROP = 2;

/* Define the states of the DAS algorithm. */
const DAS_STATE_FIRST = 'das_first';
const DAS_STATE_SECOND = 'das_second';
const DAS_STATE_THIRD = 'das_third';

/* Define the frames for the DAS algorithm. */
const DAS_FRAMES_SECOND_STATE = 16;
const DAS_FRAMES_THIRD_STATE = 6;

const PIECES = ['T', 'J', 'Z', 'O', 'S', 'L', 'I'];

/* General UI definitions. */
const TEXT_SIZE = 16;
const BORDER_STROKE_WEIGHT = 3;
const TICK_DIAMETER = 8;
const COLOR_WHITE = 255;
const COLOR_GREY = 40;
const COLOR_BLACK = 0;

/* Some constant texts in the UI. */
const TEXT_TRY_AGAIN = 'TRY AGAIN';
const TEXT_SUBMIT_AND_TRY_AGAIN = 'SUBMIT AND TRY AGAIN';
const TEXT_GAME_OVER = 'GAME OVER';
const TEXT_SUBMIT = 'INPUT USERNAME';
const TEXT_PAUSED = 'PAUSED';
const TEXT_LEVEL_SELECTOR_TITLE = 'SELECT LEVEL';
const TEXT_WAIT_SELECTION = 'WAIT FOR ADVERSARY\nLEVEL SELECTION';

/* States of the game. */
const STATE_SELECT_LEVEL = 'selectLevel';
const STATE_WAIT_ADVERSARY_SELECTION = 'waitingAdversarySelection';
const STATE_PLAY = 'play';
const STATE_GAME_OVER = 'gameOver';
const STATE_SUBMIT = 'submit';

/* Key definitions to pass from client to arena. */
const KEY_PAUSE = ' ';
const KEY_DOWN = 'key_down';
const KEY_UP = 'key_up';
const KEY_ROT_LEFT = 'key_rot_left';
const KEY_RIGHT = 'key_right';
const KEY_LEFT = 'key_left';
const KEY_ENTER = 'key_enter';

/* This class controls the highest level logic of the game. */
class Client {
	constructor(canvasWidth, canvasHeight, mode) {
		console.log('Creating client object in mode: ' + mode);
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.mode = mode;

		/* Create an active arena for the player and an adversary's arena. */
		this.activeArena = undefined;
		this.adversaryArena = undefined;

		/* Create the paused text box in the center. */
		let boxWidth = 100;
		let boxHeight = canvasHeight / 10;
		this.pausedBox = new TextBox((canvasWidth - boxWidth) / 2, (canvasHeight - boxHeight) / 2, boxWidth, boxHeight, TEXT_PAUSED, true, COLOR_GREY);

		/* Create a next piece generator. */
		this.nextPieceGenerator = new NextPieceGenerator(mode);

		/* High level control of the game. */
		this.paused = false;
		this.lost = false;

		/* Keep track of some values for the arenas. */
		this.arenaInfo = {
			active: {highScore: 0, initialLevelSelected: 0},
			adversary: {highScore: 0, initialLevelSelected: 0}
		};
	}

	/* Gives a new value for the active arena. */
	initializeActiveArena() {
		if (this.mode == MODE_SOLO) {
			this.activeArena = new Arena(0, 0, this.canvasWidth, this.canvasHeight, false);
		}
		else if (this.mode == MODE_DUO) {
			this.activeArena = new Arena(0, 0, this.canvasWidth / 2, this.canvasHeight, false);
			this.activeArena.setInitialLevel(this.arenaInfo.active.initialLevelSelected);
		}
		this.activeArena.setHighScore(this.arenaInfo.active.highScore);
	}

	/* Gives a new value for the adversary arena. */
	initializeAdversaryArena() {
		this.adversaryArena = new Arena(this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasHeight, true);
		this.adversaryArena.setHighScore(this.arenaInfo.adversary.highScore);
		this.adversaryArena.setInitialLevel(this.arenaInfo.adversary.initialLevelSelected);
	}

	/* In duo mode, begin the game when the server has found two players. */
	beginDuoGame(data) {
		this.initializeActiveArena();
		this.initializeAdversaryArena();
		this.nextPieceGenerator.receiveFirstBatch(data);

		/* Initialize the next piece generator. */
		this.nextPieceGenerator.initialize();

		/* Send the first two pieces to both arenas. */
		this.nextPieceGenerator.sendFirstPieces(this.activeArena);
		this.nextPieceGenerator.sendFirstPieces(this.adversaryArena);
	}

	/* The server tells the client to end the duo game. */
	endDuoGame() {
		this.activeArena = undefined;
		this.adversaryArena = undefined;
	}

	/* The server has sent an update on the adversary's arena. */
	receiveAdversaryArenaUpdate(data) {
		this.adversaryArena.receiveServerUpdate(data);
	}

	/* The server has sent the next batch of pieces. */
	receiveNextBatch(data) {
		this.nextPieceGenerator.receiveBatch(data);
	}

	/* The server updates the position of the adversary piece. */
	receiveAdversaryPiece(data) {
		this.adversaryArena.receivePiece(data);
	}

	/* Gets called when a key is pressed. */
	keyPressed(code, key) {
		if (key == KEY_PAUSE) {
			if (this.mode == MODE_SOLO && !this.lost || this.mode == MODE_DUO) {
				this.togglePause();
			}

			/* In duo mode, notify the server about the pause event. */
			if (this.mode == MODE_DUO) {
				this.sendMessage('pause', {});
			}
		}
		else {
			/* For any other key, get the definition and send it to the arena. */
			if (this.activeArena != undefined && !this.paused) {
				this.activeArena.keyPressed(this.decideKeyDefinition(code, key), code, key, this.mode);
			}
		}
	}

	/* Decides a common definition depending on the key pressed. */
	decideKeyDefinition(code, key) {
		if (code == UP_ARROW || key == 'w' || key == 'x') {
			return KEY_UP;
		}
		else if (key == 'z') {
			return KEY_ROT_LEFT;
		}
		else if (code == DOWN_ARROW || key == 's') {
			return KEY_DOWN;
		}
		else if (code == RIGHT_ARROW || key == 'd') {
			return KEY_RIGHT;
		}
		else if (code == LEFT_ARROW || key == 'a') {
			return KEY_LEFT;
		}
		else if (code == ENTER) {
			return KEY_ENTER;
		}
		else {
			return undefined;
		}
	}

	/* Gets called when a key is released. */
	keyReleased(code, key) {
		if (this.activeArena != undefined) {
			let definition = this.decideKeyDefinition(code, key);
			if (definition != undefined) {
				this.activeArena.keyReleased(definition);
			}
		}
	}

	/* Sends a message, through web sockets, to the server. */
	sendMessage(message, data) {
		console.log('Sending message: ' + message);
		socket.emit(message, data);
	}

	/* The arena notifies the client that this player has lost. */
	playerLost(highScore) {
		this.lost = true;

		/* Keep a copy of the high score. */
		this.arenaInfo.active.highScore = highScore;

		if (this.mode == MODE_DUO) {
			this.sendMessage('lost', {high: highScore});
		}
	}

	/* The server notifies me that the other player has lost. */
	adversaryLost(data) {
		this.arenaInfo.adversary.highScore = data.high;
		this.adversaryArena.setHighScore(data.high);
		this.adversaryArena.setState(STATE_GAME_OVER);
	}

	/* Toggle the paused state (this event can be sent by the server or performed by the player). */
	togglePause() {
		this.paused = this.paused ? false : true;
	}

	/* The player in the active arena wants to start again. */
	startAgain() {
		this.lost = false;
		this.initializeActiveArena();

		if (this.mode == MODE_DUO) {
			/* Initialize the next piece generator and send in the first pieces. */
			this.nextPieceGenerator.initialize();
			this.nextPieceGenerator.sendFirstPieces(this.activeArena);

			/* Jump over the level selection state and notify the server. */
			this.activeArena.setState(STATE_PLAY);
			this.sendMessage('startedAgain');
		}
	}

	/* The adversary has started again. */
	adversaryStartAgain(data) {
		this.initializeAdversaryArena();
		this.nextPieceGenerator.sendFirstPieces(this.adversaryArena);

		/* Jump directly to play state. */
		this.adversaryArena.setState(STATE_PLAY);
	}

	/* The arena tells the client that an initial level has been selected. */
	playerSelectedInitialLevel(level) {
		if (this.mode == MODE_SOLO) {
			this.activeArena.setState(STATE_PLAY);
		}
		else if (this.mode == MODE_DUO) {
			/* Keep a copy of this initial level, it will be the same for the whole game. */
			this.arenaInfo.active.initialLevelSelected = level;

			/* If the adversary has also selected, set the state to play. */
			if (this.adversaryArena.state == STATE_WAIT_ADVERSARY_SELECTION) {
				this.activeArena.setState(STATE_PLAY);
				this.adversaryArena.setState(STATE_PLAY);
				this.sendMessage('updateState', {state: STATE_PLAY, level: level});
			}
			else {
				this.activeArena.setState(STATE_WAIT_ADVERSARY_SELECTION);
				this.sendMessage('updateState', {state: STATE_WAIT_ADVERSARY_SELECTION, level: level});
			}
		}
	}

	/* The adversary has updated their state. */
	updateState(data) {
		/* Keep a copy of the state. */
		this.adversaryArena.setState(data.state);

		/* Additional logic for some of the state changes. */
		if (data.state == STATE_PLAY || data.state == STATE_WAIT_ADVERSARY_SELECTION) {
			/* Keep a copy of the level and update adversary arena. */
			this.arenaInfo.adversary.initialLevelSelected = data.level;
			this.adversaryArena.setInitialLevel(data.level);

			/* Set both players to play if state is play. */
			if (data.state == STATE_PLAY) {
				this.activeArena.setState(STATE_PLAY);
			}
		}
	}

	/* The adversary has updated their selection in a selector box. */
	updateSelector(data) {
		this.adversaryArena.updateSelector(data);
	}

	/* The adversary sends the new content of their input box. */
	updateInputBox(data) {
		if (this.mode == MODE_DUO && this.adversaryArena.state == STATE_SUBMIT) {
			this.adversaryArena.updateInputBox(data.text);
		}
	}

	/* The arena asks for the next piece. */
	getNextPiece() {
		return this.nextPieceGenerator.getNextPiece();
	}

	/* Main loop that updates the arenas. */
	update() {
		/* In solo mode, initialize active arena if not defined. */
		if (this.mode == MODE_SOLO && this.activeArena == undefined) {
			this.initializeActiveArena();
		}

		/* Update the active arena if not paused and not lost. */
		if (this.activeArena != undefined && !this.paused && !this.lost) {
			this.activeArena.update(this.mode);
		}
	}

	display() {
		/* Display the arenas if defined. */
		if (this.activeArena != undefined) {
			this.activeArena.display();
		}
		if (this.adversaryArena != undefined) {
			this.adversaryArena.display();
		}

		/* Display the pause box if needed. */
		if (this.paused) {
			if (this.activeArena != undefined) {
				this.activeArena.blurBackground();
			}
			if (this.mode == MODE_DUO && this.adversaryArena != undefined) {
				this.adversaryArena.blurBackground();
			}
			this.pausedBox.display();
		}
	}
}
