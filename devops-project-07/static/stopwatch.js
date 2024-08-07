/* The stopwatch class keeps track of the time an animation
has been running. Each arena has a stopwatch that counts the time
until the piece has to move down, according to its speed (which depends on the level). */
class Stopwatch {
	constructor() {
		this.startTime = undefined;
		this.running = false;
		this.elapsedTime = undefined;
	}

	/* Starts the stopwatch */
	start() {
		this.startTime = new Date();
		this.running = true;
		this.elapsedTime = undefined;
	}

	/* Stops the stopwatch */
	stop() {
		this.elapsedTime = new Date() - this.startTime;
		this.running = false;
	}

	/* Returns the time elapsed since the beginning of the animation. */
	getElapsedTime() {
		if (this.running) {
			return new Date() - this.startTime;
		}
		else {
			return this.elapsedTime;
		}
	}

	/* Answers if this stopwatch is currently running. */
	isRunning() {
		return this.running;
	}

	/* Resets the stopwatch to the default values. */
	reset() {
		this.elapsedTime = undefined;
	}
}
