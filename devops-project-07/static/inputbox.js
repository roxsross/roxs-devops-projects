class InputBox extends ElementBox {
	constructor(initialx, initialy, width, height, title) {
		super(initialx, initialy, width, height, true, COLOR_GREY);

		/* Create a text box for the title. */
		this.titleBox = new TextBox(initialx, initialy, width, height / 2, title, true, COLOR_BLACK);

		/* Create a text box for the user input. */
		this.textBox = new TextBox(initialx, initialy + height / 2, width, height / 2, '', true, COLOR_BLACK);
	}

	keyPressed(key, code, mode) {
		/* If backspace, remove the last letter. */
		if (code == BACKSPACE) {
			let currentText = this.textBox.getText();
			this.textBox.changeText(currentText.substring(0, currentText.length - 1));

			/* Notify the server if in duo mode. */
			if (mode == MODE_DUO) {
				this.sendServerUpdate();
			}
		}

		/* Add the letter only if it is lowercase. */
		else if (key.match(/^[a-z0-9]+$/)) {
			this.textBox.changeText(this.textBox.getText() + key);

			/* Notify the server if in duo mode. */
			if (mode == MODE_DUO) {
				this.sendServerUpdate();
			}
		}
	}

	sendServerUpdate() {
		client.sendMessage('updateInputBox', {text: this.textBox.getText()});
	}

	/* Leaves the input clean. */
	initialize() {
		this.textBox.changeText('');
	}

	/* Returns the currently stored input text. */
	getInput() {
		return this.textBox.getText();
	}

	setInput(text) {
		this.textBox.changeText(text);
	}

	display() {
		super.display();
		this.titleBox.display();
		this.textBox.display();
	}
}
