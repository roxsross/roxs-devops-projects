/* Class that represents a simple text box that can be displayed. */
class TextBox extends ElementBox {
	constructor(initialx, initialy, width, height, initialText, border, fill) {
		/* Call the superclass constructor. */
		super(initialx, initialy, width, height, border, fill);

		/* Calculate the coordinates of the center of the box. */
		this.centerx = this.initialx + this.width / 2;
		this.centery = this.initialy + this.height / 2;

		/* Keep the initial text. */
		this.text = initialText;
	}

	/* Replaces the text. */
	changeText(text) {
		this.text = text;
	}

	/* Returns the current text stored. */
	getText() {
		return this.text;
	}

	display() {
		super.display();

		/* Display the text centered. */
		fill(COLOR_WHITE);
		noStroke();
		textSize(TEXT_SIZE);
		textAlign(CENTER, CENTER);
		text(this.text, this.centerx, this.centery);
	}
}
