class TickBox {
	constructor(initialx, initialy, width, height) {
		/* Calculate the center of the ellipses. */
		this.centers = {};
		this.centers.left = {
			x: initialx + height / 2,
			y: initialy + height / 2
		};
		this.centers.right = {
			x: initialx + width - height / 2,
			y: initialy + height / 2
		};

		/* All tick boxes start deselected by default. */
		this.selected = false;
	}

	isSelected() {
		return this.selected;
	}

	select() {
		this.selected = true;
	}

	deselect() {
		this.selected = false;
	}

	/* Draw a little ellipse in the middle if selected. */
	display() {
		if (this.selected) {
			ellipseMode(CENTER);
			fill(0, 255, 0);
			noStroke();
			for (let situation in this.centers) {
				ellipse(this.centers[situation].x, this.centers[situation].y, TICK_DIAMETER, TICK_DIAMETER);
			}
		}
	}
}
