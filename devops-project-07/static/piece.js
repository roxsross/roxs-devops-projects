/* This is the tetromino piece. It begins at the top and moves down. */
class Piece {
	constructor(type) {
		this.squares = [];
		this.center = undefined;
		this.type = undefined;

		/* If type is undefined, just create an empty piece. */
		if (type == undefined) {
			return;
		}

		/* If a type was provided, create the piece of the appropriate type. */
		let centeri = 0, centerj = 5;
		this.type = type;
		switch (type) {
			case 'T':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'J':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj + 1, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'Z':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri + 1, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'O':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				break;
			case 'S':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj, true));
				this.squares.push(new Square(centeri + 1, centerj - 1, true));
				break;
			case 'L':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri + 1, centerj - 1, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				break;
			case 'I':
				this.squares.push(new Square(centeri, centerj, true));
				this.squares.push(new Square(centeri, centerj + 1, true));
				this.squares.push(new Square(centeri, centerj - 1, true));
				this.squares.push(new Square(centeri, centerj - 2, true));
				break;
		}

		/* Point the center piece to the first one. */
		this.center = this.squares[0];
	}

	/* Tries to move the piece in the requested direction. */
	move(direction, grid) {
		for (let square of this.squares) {
			if (!square.canMove(direction, grid)) {
				return false;
			}
		}

		/* All the squares can move, so the piece can move. */
		for (let square of this.squares) {
			square.move(direction);
		}

		return true;
	}

	/* Tries to rotate this piece inside the grid provided. */
	rotate(grid, rotationDirection) {
		/* Do not rotate the square piece. */
		if (this.type == 'O') {
			return false;
		}

		/* Create a new piece that is this one rotated and check the validity of all positions. */
		let rotatedPiece = this._createRotatedPiece(rotationDirection);
		for (let square of rotatedPiece.squares) {
			if (!grid.validPosition(square.i, square.j)) {
				return false;
			}
		}

		/* All the squares occupy valid positions, so copy the rotated piece into this one. */
		this.getValuesFrom(rotatedPiece);

		return true;
	}

	/* Copies the values from the piece given as an argument. */
	getValuesFrom(piece) {
		this.type = piece.type;
		this.squares = [];
		for (let square of piece.squares) {
			this.squares.push(new Square(square.i, square.j, true));
		}
		this.center = this.squares[0];
	}

	/* Packs the information about the piece for the server. */
	packServerUpdate() {
		let pack = {};
		pack['squares'] = [];
		for (let square of this.squares) {
			pack['squares'].push({'i': square.i, 'j': square.j});
		}

		return pack;
	}

	/* Receives the piece updated from the server (this is the adversary's piece). */
	receiveServerUpdate(data) {
		this.squares = [];
		for (let square of data['squares']) {
			this.squares.push(new Square(square.i, square.j, true));
		}
		this.center = this.squares[0];
	}

	/* Displays this piece calling display on each of the squares. */
	display(initialx, initialy, size) {
		for (let square of this.squares) {
			square.display(initialx, initialy, size);
		}
	}

	/* Returns a new piece with the squares of this one rotated
	in the requested direction. */
	_createRotatedPiece(rotationDirection) {
		let rotatedPiece = new Piece(undefined);
		for (let square of this.squares) {
			let newSquare = square.rotatedFrom(this.center, rotationDirection);
			rotatedPiece.squares.push(newSquare);
		}
		rotatedPiece.center = rotatedPiece.squares[0];
		rotatedPiece.type = this.type;

		return rotatedPiece;
	}
}
