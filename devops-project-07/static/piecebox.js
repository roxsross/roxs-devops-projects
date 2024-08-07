/* This is a little box where a piece can be represented (for stats and next boxes). */
class PieceBox extends ElementBox {
	constructor(initialx, initialy, width, height) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, false, false);

		/* Calculate limits for the piece inside this box. */
		let pieceWidth, pieceHeight;
		if (width > 2 * height) {
			/* The limiting dimension is the height. */
			pieceHeight = (80 / 100) * height;
			pieceWidth = pieceHeight * 2;
		}
		else {
			/* The limiting dimension is the width. */
			pieceWidth = (80 / 100) * width;
			pieceHeight = pieceWidth / 2;
		}
		this.initialxPiece = initialx + (width - pieceWidth) / 2;
		this.initialyPiece = initialy + (height - pieceHeight) / 2;

		/* Calculate the size of one square. */
		this.size = pieceWidth / 4;

		/* The piece that will be displayed inside the box. */
		this.piece = undefined;
	}

	/* Updates the stored piece. */
	updatePiece(piece) {
		this.piece = new Piece(undefined);
		for (let square of piece.squares) {
			/* Calculate positions relative to the center piece. */
			let iRelative = square.i - piece.center.i;
			let jRelative = square.j - piece.center.j;
			this.piece.squares.push(new Square(iRelative, 2 + jRelative, true));
		}
		this.piece.center = this.piece.squares[0];
	}

	/* Display each of the squares in the stored piece. */
	display() {
		super.display();

		if (this.piece != undefined) {
			for (let square of this.piece.squares) {
				square.display(this.initialxPiece, this.initialyPiece, this.size);
			}
		}
	}
}
