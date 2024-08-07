class StatBox extends ElementBox {
	constructor(initialx, initialy, width, height) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true, COLOR_BLACK);

		/* Create piece boxes for each of the pieces on the left sides,
		numerical counters and text messages for the right side. */
		this.pieceBoxes = {};
		this.countNumbers = {};
		this.countTextBoxes = {};
		for (let i = 0; i < PIECES.length; i++) {
			this.pieceBoxes[PIECES[i]] = new PieceBox(initialx, initialy + i * height / 7, width / 2, height / 7);
			this.pieceBoxes[PIECES[i]].updatePiece(new Piece(PIECES[i]));
			this.countNumbers[PIECES[i]] = 0;
			this.countTextBoxes[PIECES[i]] = new TextBox(initialx + width / 2, initialy + i * height / 7, width / 2, height / 7, '0', false, COLOR_BLACK);
		}
	}

	/* Receives a piece label and counts +1 to the stats of that piece. */
	updateCounts(label) {
		this.countNumbers[label] += 1;
		this.countTextBoxes[label].changeText(this.countNumbers[label]);
	}

	/* Returns an object with info about this stat box for the server. */
	packServerUpdate() {
		let pack = {};
		for (let piece of PIECES) {
			pack[piece] = this.countNumbers[piece];
		}

		return pack;
	}

	/* Receives a JSON object from the server with new info about this stat box. */
	receiveServerUpdate(data) {
		for (let piece of PIECES) {
			this.countNumbers[piece] = data[piece];
		}
		this.updateAllTextBoxes();
	}

	/* When all the counts have been updated, call this function to update the text boxes. */
	updateAllTextBoxes() {
		for (let piece of PIECES) {
			this.countTextBoxes[piece].changeText(this.countNumbers[piece]);
		}
	}

	display() {
		super.display();

		for (let piece of PIECES) {
			this.pieceBoxes[piece].display();
			this.countTextBoxes[piece].display();
		}
	}
}
