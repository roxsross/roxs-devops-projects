/* This is the main grid for Tetris, 20x10, where the pieces that fall to the floor
are stored. */
class Grid extends ElementBox {
	constructor(initialx, initialy, width, height) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true, COLOR_BLACK);

		/* Calculate the size of one square in pixels. */
		this.squareSize = this.width / 10;

		/* Create a double array to store the squares. */
		this.squares = [];
		for (let i = 0; i < 20; i++) {
			this.squares.push([]);
			for (let j = 0; j < 10; j++) {
				this.squares[i].push(new Square(i, j, false));
			}
		}
	}

	/* Receives a piece and keeps its squares. */
	receive(piece) {
		for (let k = 0; k < piece.squares.length; k++) {
			this.squares[piece.squares[k].i][piece.squares[k].j].visible = true;
		}
	}

	/* Decides if the position is valid inside the grid. */
	validPosition(i, j) {
		/* Check the borders of the canvas */
		if (!(0 <= i && i < 20) || !(0 <= j && j < 10)) {
			return false;
		}

		/* Check if this position is already occupied in the grid. */
		if (this.squares[i][j].visible) {
			return false;
		}

		return true;
	}

	/* Called by the arena, detects the full lines in the grid, clears them and returns
	the number of them. */
	getNumFullLinesAndClear() {
		/* Create a list with the indices of the full lines. */
		let fullLines = [];
		let lineFull = false;
		for (let i = 0; i < 20; i++) {
			lineFull = true;
			for (let j = 0; j < 10; j++) {
				if (!this.squares[i][j].visible) {
					lineFull = false;
					break;
				}
			}

			/* If this line is full, add it to the list. */
			if (lineFull) {
				fullLines.push(i);
			}
		}

		/* Clear the full lines from the grid. */
		this._clearLines(fullLines);

		/* Return the number of full lines. */
		return fullLines.length;
	}

	/* Packs the info about this grid for the server. */
	packServerUpdate() {
		let pack = [];
		for (let i = 0; i < 20; i++) {
			pack.push([]);
			for (let j = 0; j < 10; j++) {
				pack[i].push({visible: this.squares[i][j].visible});
			}
		}

		return pack;
	}

	/* The server sends info to update this grid. */
	receiveServerUpdate(data) {
		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 10; j++) {
				this.squares[i][j].visible = data[i][j].visible;
			}
		}
	}

	/* Displays the contents of the grid. */
	display () {
		/* Display each of the squares */
		for (let i = 0; i < this.squares.length; i++) {
			for (let j = 0; j < this.squares[i].length; j++) {
				this.squares[i][j].display(this.initialx, this.initialy, this.squareSize);
			}
		}

		/* Display the border around the grid. */
		super.display();
	}

	/* Receives a list with the indices of the full lines and clears them. When a line
	is cleared, the grid moves downwards. */
	_clearLines(fullLines) {
		for (let i = 0; i < fullLines.length; i++) {
			/* Iterate from the current line to the top. */
			for (let k = fullLines[i]; k >= 0; k--) {
				for (let j = 0; j < 10; j++) {
					/* If not the first row, copy the (k-1)-th line into the k-th line. */
					if (k != 0) {
						this.squares[k][j].visible = this.squares[k - 1][j].visible;
					}
					/* Set the first row black. */
					else {
						this.squares[k][j].visible = false;
					}
				}
			}
		}
	}
}
