class NextPieceBox extends ElementBox {
	constructor(initialx, initialy, width, height) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, true, COLOR_BLACK);

		/* A 'NEXT' text will occupy the top fourth of the space. */
		this.nextTextBox = new TextBox(initialx, initialy, width, height / 4, 'NEXT', false, COLOR_BLACK);

		/* Create a new PieceBox for the next piece in the space remaining, at the bottom. */
		this.pieceBox = new PieceBox(initialx, initialy + height / 4, width, 3 * height / 4);
	}

	/* Receives a new piece and updates the piece box inside. */
	updatePiece(piece) {
		this.pieceBox.updatePiece(piece);
	}

	display() {
		super.display();
		this.nextTextBox.display();
		this.pieceBox.display();
	}
}
