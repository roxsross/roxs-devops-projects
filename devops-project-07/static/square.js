/* These are each of the squares that form the grid or the falling pieces. */
class Square {
	constructor(i, j, visible) {
		/* Store the values. */
		this.i = i;
		this.j = j;
		this.visible = visible;
	}

	/* Moves this square in the desired direction. */
	move(direction) {
		if (direction == DIR_DOWN) {
			this.i += 1;
		}
		else if (direction == DIR_RIGHT) {
			this.j += 1;
		}
		else if (direction == DIR_LEFT) {
			this.j -= 1;
		}
	}

	/* Receives a movement and a grid and decides if the movement is allowed. */
	canMove(direction, grid) {
		let nexti, nextj;
		if (direction == DIR_DOWN) {
			nexti = this.i + 1;
			nextj = this.j;
		}
		else if (direction == DIR_LEFT) {
			nexti = this.i;
			nextj = this.j - 1;
		}
		else if (direction == DIR_RIGHT) {
			nexti = this.i;
			nextj = this.j + 1;
		}
		else {
			return false;
		}

		/* Validate the new positions in the grid. */
		if (!grid.validPosition(nexti, nextj)) {
			return false;
		}

		/* At this point, the simulation was correct, the square can move. */
		return true;
	}

	/* Returns a new square that is this one rotated from the center given. */
	rotatedFrom(center, rotationDirection) {
		let idelta, jdelta;
		if (rotationDirection == ROTATION_DIR_RIGHT) {
			idelta = this.j - center.j;
			jdelta = center.i - this.i;
		}
		else if (rotationDirection == ROTATION_DIR_LEFT) {
			idelta = center.j - this.j;
			jdelta = this.i - center.i;
		}

		return new Square(center.i + idelta, center.j + jdelta, true);
	}

	/* Displays this square if visible. Receives the sizes of the grid. */
	display(initialx, initialy, size) {
		if (this.visible) {
			fill(0, 255, 0);
			stroke(0);
			strokeWeight(3);
			rect(initialx + this.j * size, initialy + this.i * size, size, size);
		}
	}
}
