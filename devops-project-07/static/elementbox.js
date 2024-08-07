/* Basic box that acts as a container and can have a border and a fill color. */
class ElementBox {
	constructor(initialx, initialy, width, height, border, fill) {
		this.initialx = initialx;
		this.initialy = initialy;
		this.width = width;
		this.height = height;
		this.border = border;
		this.fill = fill;
	}

	display() {
		/* Fill the background if requested. */
		if (this.fill != COLOR_BLACK) {
			noStroke();
			fill(this.fill);
			rect(this.initialx, this.initialy, this.width, this.height);
		}

		/* Display a border around the box if requested. */
		if (this.border) {
			stroke(COLOR_WHITE);
			strokeWeight(BORDER_STROKE_WEIGHT);
			line(this.initialx, this.initialy, this.initialx + this.width, this.initialy);
			line(this.initialx + this.width, this.initialy, this.initialx + this.width, this.initialy + this.height);
			line(this.initialx + this.width, this.initialy + this.height, this.initialx, this.initialy + this.height);
			line(this.initialx, this.initialy + this.height, this.initialx, this.initialy);
		}
	}
}
