/* The arena handles all the information about one player. */
class Arena extends ElementBox {
	constructor(initialx, initialy, width, height, mirror) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true, COLOR_BLACK);

		/* Decide dimensions and initial positions. */
		let widthPanel = width - height / 2;
		let initialxGrid, initialxPanel;
		if (!mirror) {
			initialxGrid = initialx;
			initialxPanel = initialx + height / 2;
		}
		else {
			initialxPanel = initialx;
			initialxGrid = initialx + widthPanel;
		}

		/* Create the grid. */
		this.grid = new Grid(initialxGrid, initialy, height / 2, height);

		/* Create the elements of the panel. */
		let initialScoreBoxMessage = 'SCORE: 0\nHIGH: 0';
		this.scoreBox = new TextBox(initialxPanel, initialy, widthPanel, height / 8, initialScoreBoxMessage, true, COLOR_BLACK);
		let initialLevelLinesBoxMessage = 'LEVEL: 0\nLINES: 0';
		this.levelLinesBox = new TextBox(initialxPanel, initialy + height / 8, widthPanel, height / 8, initialLevelLinesBoxMessage, true, COLOR_BLACK);
		this.nextPieceBox = new NextPieceBox(initialxPanel, initialy + height / 4, widthPanel, height / 4);
		this.statBox = new StatBox(initialxPanel, initialy + height / 2, widthPanel, height / 2);

		/* Create the current piece and the next piece. */
		this.piece = undefined;
		this.nextPiece = undefined;

		/* Create a stopwatch to time the animation of the falling piece. */
		this.stopwatch = new Stopwatch();

		/* Variables for the logic of the game. */
		this.initialLevel = 0;
		this.level = 0;
		this.high = 0;
		this.score = 0;
		this.lines = 0;

		/* Create the DAS algorithm that will handle left and right movements. */
		this.das = new Das();

		/* Create a dictionary for the keys that are pressed. */
		this.keysPressed = {
			KEY_DOWN: false,
			KEY_RIGHT: false,
			KEY_LEFT: false,
		};

		/* Establish the initial state of the arena. */
		this.state = STATE_SELECT_LEVEL;

		/* Create the centered boxes. */
		let boxWidth, boxHeight, initialxBox, initialyBox;

		/* Create the level selector box. */
		let levelOptions = Array.from({length: 10}, (value, index) => index);
		boxWidth = width / 3;
		boxHeight = 3 * height / 4;
		initialxBox = initialx + (width - boxWidth) / 2;
		initialyBox = initialy + (height - boxHeight) / 2;
		this.levelSelectorBox = new SelectorBox(initialxBox, initialyBox, boxWidth, boxHeight, TEXT_LEVEL_SELECTOR_TITLE, levelOptions);

		/* Create the wait adversary selection box. */
		boxWidth = width / 2;
		boxHeight = height / 7;
		initialxBox = initialx + (width - boxWidth) / 2;
		initialyBox = initialy + (height - boxHeight) / 2;
		this.waitAdversarySelectionBox = new TextBox(initialxBox, initialyBox, boxWidth, boxHeight, TEXT_WAIT_SELECTION, true, COLOR_GREY);

		/* Create the game over selector. */
		let gameOverOptions = [TEXT_TRY_AGAIN, TEXT_SUBMIT_AND_TRY_AGAIN];
		boxWidth = 3 * width / 4;
		boxHeight = height / 4;
		initialxBox = initialx + (width - boxWidth) / 2;
		initialyBox = initialy + (height - boxHeight) / 2;
		this.gameOverSelectorBox = new SelectorBox(initialxBox, initialyBox, boxWidth, boxHeight, TEXT_GAME_OVER, gameOverOptions);

		/* Create the high score submit box. */
		this.submitBox = new InputBox(initialxBox, initialyBox, boxWidth, boxHeight, TEXT_SUBMIT);

		/* Calculate the time of one animation, depending on the level. */
		this.timePerAnimation = {};
		for (let level of Object.keys(FRAMES)) {
			this.timePerAnimation[level] = FRAMES[level] * 1000 / 60;
		}
		this.timeSoftDrop = FRAMES_SOFT_DROP * 1000 / 60;
	}

	/* Update the elements in the arena. Function called in a loop. */
	update(mode) {
		if (this.state == STATE_PLAY) {
			/* When the next piece is undefined, grab it from the next piece generator. */
			if (this.nextPiece == undefined) {
				this.nextPiece = client.getNextPiece();
				this.nextPieceBox.updatePiece(this.nextPiece);

				/* Only in duo mode, send an update of the current arena. */
				if (mode == MODE_DUO) {
					client.sendMessage('updateArena', this.packServerUpdate());
				}
			}

			/* When the piece is not defined, grab it from the next piece. */
			if (this.piece == undefined) {
				this.piece = new Piece(undefined);
				this.piece.getValuesFrom(this.nextPiece);
				this.statBox.updateCounts(this.piece.type);
				this.nextPiece = undefined;
				this.stopwatch.start();
			}

			/* If the right or left keys are currently pressed, try to move the
			piece right or left depending on the state of the DAS. */
			if (this.keysPressed[KEY_LEFT]) {
				if (this.das.canMove()) {
					if (this.piece.move(DIR_LEFT, this.grid) && mode == MODE_DUO) {
						client.sendMessage('updatePiece', this.packPiece());
					}
				}
			}
			else if (this.keysPressed[KEY_RIGHT]) {
				if (this.das.canMove()) {
					if (this.piece.move(DIR_RIGHT, this.grid) && mode == MODE_DUO) {
						client.sendMessage('updatePiece', this.packPiece());
					}
				}
			}

			/* Try to move the piece down. */
			if (this.keysPressed[KEY_DOWN]) {
				if (this.stopwatch.getElapsedTime() > this.timeSoftDrop) {
					if (this.movePieceDown() && mode == MODE_DUO) {
						client.sendMessage('updatePiece', this.packPiece());
					}
				}
			}
			else if (this.stopwatch.getElapsedTime() > this._calculateElapsedTimeFromLevel()) {
				if (this.movePieceDown() && mode == MODE_DUO) {
					client.sendMessage('updatePiece', this.packPiece());
				}
			}
		}
	}

	/* Logic for the piece moving down. */
	movePieceDown() {
		/* If the piece is not able to move down, replace the current piece. */
		if (!this.piece.move(DIR_DOWN, this.grid)) {
			/* The piece was not able to move down, so drop it in the grid. */
			this.grid.receive(this.piece);
			this.piece = undefined;

			/* Get the number of lines that are full and also clear them. */
			let numFullLines = this.grid.getNumFullLinesAndClear();

			/* Calculate the new score and lines. */
			this._assignScoreLinesLevel(numFullLines);

			/* Check if this player has lost. */
			this.checkLose();

			/* Mark all movement keys as not pressed. */
			this.keysPressed[KEY_LEFT] = false;
			this.keysPressed[KEY_RIGHT] = false;
			this.keysPressed[KEY_DOWN] = false;

			return false;
		}

		/* The piece was able to move down, restart the stopwatch for a new animation frame. */
		this.stopwatch.start();
		return true;
	}

	/* Handles keys pressed on the keyboard. */
	keyPressed(keyDefinition, code, key, mode) {
		if (this.state == STATE_SELECT_LEVEL) {
			if (keyDefinition == KEY_UP || keyDefinition == KEY_DOWN) {
				this.levelSelectorBox.keyPressed(keyDefinition, mode);
			}
			else if (keyDefinition == KEY_ENTER) {
				let initialLevel = this.levelSelectorBox.getActiveTickBoxIndex();
				this.initialLevel = initialLevel;
				this.level = initialLevel;
				this._updateLevelLinesBox();
				client.playerSelectedInitialLevel(this.level);
			}
		}
		else if (this.state == STATE_PLAY) {
			if (keyDefinition == KEY_LEFT && !this.keysPressed[KEY_RIGHT] || keyDefinition == KEY_RIGHT && !this.keysPressed[KEY_LEFT]) {
				this.keysPressed[keyDefinition] = true;
				this.das.activate();
			}
			else if (keyDefinition == KEY_DOWN) {
				this.keysPressed[keyDefinition] = true;
			}
			else if (keyDefinition == KEY_UP && this.piece != undefined) {
				if (this.piece.rotate(this.grid, ROTATION_DIR_RIGHT) && mode == MODE_DUO) {
					client.sendMessage('updatePiece', this.packPiece());
				}
			}
			else if (keyDefinition == KEY_ROT_LEFT && this.piece != undefined) {
				if (this.piece.rotate(this.grid, ROTATION_DIR_LEFT) && mode == MODE_DUO) {
					client.sendMessage('updatePiece', this.packPiece());
				}
			}
		}
		else if (this.state == STATE_GAME_OVER) {
			if (keyDefinition == KEY_UP || keyDefinition == KEY_DOWN) {
				this.gameOverSelectorBox.keyPressed(keyDefinition, mode);
			}
			else if (keyDefinition == KEY_ENTER) {
				let optionSelected = this.gameOverSelectorBox.getActiveTickBoxIndex();
				if (optionSelected == 0) {
					client.startAgain();
				}
				else if (optionSelected == 1) {
					this.state = STATE_SUBMIT;
					client.sendMessage('updateState', {state: STATE_SUBMIT});
				}
			}
		}
		else if (this.state == STATE_SUBMIT) {
			if (keyDefinition == KEY_ENTER) {
				let username = this.submitBox.getInput();
				client.sendMessage('submit', {username: username, mode: mode, high: this.high});
				client.startAgain();
			}
			else {
				this.submitBox.keyPressed(key, code, mode);
			}
		}
	}

	/* Handles keys released from the keyboard. */
	keyReleased(keyDefinition) {
		if (keyDefinition == KEY_LEFT && this.keysPressed[KEY_LEFT] || keyDefinition == KEY_RIGHT && this.keysPressed[KEY_RIGHT]) {
			this.keysPressed[keyDefinition] = false;
			this.das.deactivate();
		}
		else if (keyDefinition == KEY_DOWN && this.keysPressed[KEY_DOWN]) {
			this.keysPressed[KEY_DOWN] = false;
		}
	}

	/* Checks if the player has lost and notifies the client. */
	checkLose() {
		for (let j = 0; j < 10; j++) {
			if (this.grid.squares[0][j].visible) {
				/* Update the high score if needed. */
				if (this.score > this.high) {
					this.high = this.score;
					this._updateScoreBox();
				}

				client.playerLost(this.high);
				this.gameOverSelectorBox.initialize();
				this.state = STATE_GAME_OVER;
				return true;
			}
		}

		return false;
	}

	/* Returns the current high score. */
	getHighScore() {
		return this.high;
	}

	/* Sets the high score. */
	setHighScore(high) {
		this.high = high;
		this._updateScoreBox();
	}

	getLevel() {
		return this.level;
	}

	/* After the arena is initialized, the initial level selected in duo mode
	is passed to the arena through this function. */
	setInitialLevel(level) {
		this.initialLevel = level;
		this.level = level;
		this._updateLevelLinesBox();
	}

	setState(state) {
		this.state = state;
	}

	/* This arena receives the first two pieces. */
	receiveFirstPieces(data) {
		this.nextPiece = new Piece(data.nextPiece);
		this.nextPieceBox.updatePiece(this.nextPiece);
		this.piece = new Piece(data.piece);
		this.statBox.updateCounts(this.piece.type);
		this.stopwatch.start();
	}

	/* Packs the arena's information to be sent to the server. */
	packServerUpdate() {
		return {
			score: this.score,
			high: this.high,
			level: this.level,
			lines: this.lines,
			grid: this.grid.packServerUpdate(),
			stats: this.statBox.packServerUpdate(),
			piece: this.piece.packServerUpdate(),
			nextPiece: this.nextPiece.type
		}
	}

	/* The server has sent an update on the adversary's arena. */
	receiveServerUpdate(data) {
		/* Keep a copy of the numerical values. */
		this.score = data.score;
		this.high = data.high;
		this.level = data.level;
		this.lines = data.lines;

		/* Upate the text boxes. */
		this._updateLevelLinesBox();
		this._updateScoreBox();

		/* Update the grid and the statistics. */
		this.grid.receiveServerUpdate(data.grid);
		this.statBox.receiveServerUpdate(data.stats);

		/* Update the piece and the next piece. */
		this.piece.receiveServerUpdate(data.piece);
		this.nextPiece = new Piece(data.nextPiece);
		this.nextPieceBox.updatePiece(this.nextPiece);
	}

	/* Packs the falling piece for the server. */
	packPiece() {
		return this.piece.packServerUpdate();
	}

	/* Receives a piece update from the server. */
	receivePiece(data) {
		this.piece.receiveServerUpdate(data);
	}

	updateSelector(data) {
		if (this.state == STATE_SELECT_LEVEL) {
			this.levelSelectorBox.setActiveTickBoxIndex(data.selection);
		}
		else if (this.state == STATE_GAME_OVER) {
			this.gameOverSelectorBox.setActiveTickBoxIndex(data.selection);
		}
	}

	updateInputBox(text) {
		this.submitBox.setInput(text);
	}

	/* Displays all the elements in the arena. */
	display() {
		super.display();

		/* Display the boxes on the right panel. */
		this.scoreBox.display();
		this.levelLinesBox.display();
		this.nextPieceBox.display();
		this.statBox.display();

		/* Display the falling piece. */
		if (this.piece != undefined) {
			this.piece.display(this.grid.initialx, this.grid.initialy, this.grid.squareSize);
		}

		/* Display the grid. */
		this.grid.display();

		if (this.state == STATE_SELECT_LEVEL) {
			this.blurBackground();
			this.levelSelectorBox.display();
		}
		else if (this.state == STATE_WAIT_ADVERSARY_SELECTION) {
			this.blurBackground();
			this.waitAdversarySelectionBox.display();
		}
		else if (this.state == STATE_GAME_OVER) {
			this.blurBackground();
			this.gameOverSelectorBox.display();
		}
		else if (this.state == STATE_SUBMIT) {
			this.blurBackground();
			this.submitBox.display();
		}
	}

	blurBackground() {
		fill(0, 180);
		noStroke();
		rect(this.initialx, this.initialy, this.width, this.height);
	}

	/* Receives the number of lines cleared in this action, and updates
	score, lines and level, and their boxes. */
	_assignScoreLinesLevel(numLinesCleared) {
		/* Update the score and the number of lines. */
		this.score += (this.level + 1) * POINTS_LEVEL_ZERO[numLinesCleared];
		this.lines += numLinesCleared;

		/* Update the level if necessary. */
		if (this.lines >= (this.initialLevel + 1) * 10) {
			this.level = Math.floor(this.lines / 10);
		}

		/* Update the boxes if necessary. */
		this._updateLevelLinesBox();
		this._updateScoreBox();
	}

	/* Updates the text inside the level lines box. */
	_updateLevelLinesBox() {
		this.levelLinesBox.changeText('LEVEL: ' + this.level + '\nLINES: ' + this.lines);
	}

	/* Updates the text inside the score box. */
	_updateScoreBox() {
		this.scoreBox.changeText('SCORE: ' + this.score + '\nHIGH: ' + this.high);
	}

	/* Returns the time a piece has to stay in place before moving down,
	depending on the current level. */
	_calculateElapsedTimeFromLevel() {
		if (this.level < 0) {
			return undefined;
		}

		if (this.level >= 0 && this.level <= 18) {
			return this.timePerAnimation[this.level];
		}
		else if (this.level >= 19 && this.level <= 28) {
			return this.timePerAnimation[19];
		}
		else {
			return this.timePerAnimation[29];
		}
	}
}
