class Das {
  constructor() {
    this.activated = false;
    this.stopwatch = new Stopwatch();
    this.state = DAS_STATE_FIRST;

    /* Calculate the time that needs to elapse for each state. */
    this.timeElapsedSecondState = DAS_FRAMES_SECOND_STATE * 1000 / 60;
    this.timeElapsedThirdState = DAS_FRAMES_THIRD_STATE * 1000 / 60;
  }

  /* Either the right or left key has been pressed, so the DAS algorithm
  has to start over. */
  activate() {
    this.activated = true;
    this.state = DAS_STATE_FIRST;
  }

  /* The right or left keys have been released, so stop the DAS algorithm.
  The state of the DAS stays the same. */
  deactivate() {
    this.activated = false;
    this.stopwatch.stop();
  }

  /* Always gets called in the update loop. */
  canMove() {
    if (this.activated) {
      if (this.state == DAS_STATE_FIRST) {
        this.stopwatch.start();
        this.state = DAS_STATE_SECOND;
        return true;
      }
      else if (this.state == DAS_STATE_SECOND) {
        /* We need to wait for 16 frames until we allow the piece to move. */
        if (this.stopwatch.getElapsedTime() > this.timeElapsedSecondState) {
          this.stopwatch.start();
          this.state = DAS_STATE_THIRD;
          return true;
        }
      }
      else if (this.state == DAS_STATE_THIRD) {
        /* We need to wait for 6 frames until we allow the piece to move again. */
        if (this.stopwatch.getElapsedTime() > this.timeElapsedThirdState) {
          this.stopwatch.start();
          return true;
        }
      }
    }

    return false;
  }
}
