let socket, mode, client;

document.addEventListener('DOMContentLoaded', () => {
	/* Connect this client to the server through web sockets. */
	socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	/* When the socket is connected, establish the request duo game button. */
	socket.on('connect', () => {
		console.log('Client connected to the server through web sockets');

		let button = document.querySelector('#request-button');
		if (typeof(button) != 'undefined' && button != null) {
			button.onclick = () => {
				console.log('Requesting duo game to the server');
				socket.emit('requestDuoGame', {});
			}
		}
	});

	/* When the server wants us to wait for another player, remove the button and display
	a waiting text. */
	socket.on('waitingForAnotherPlayer', data => {
		console.log('Received message: waiting for a nother player');
		document.querySelector('#duo-content').innerHTML = '<p>Please wait while we find you another player...</p>';
	});

	/* The server says that the room is currently full. */
	socket.on('allRoomsFull', data => {
		console.log('Received message: all rooms full');
		document.querySelector('#duo-content').innerHTML = '<p>Sorry, all rooms are currently full. Please try again later.</p>';
	});

	/* The server tells us everything is ready to start duo game. Remove everything except the canvas. */
	socket.on('beginDuoGame', data => {
		console.log('Received message: begin duo game');
		document.querySelector('#duo-content').innerHTML = '';
		document.querySelector('#canvas-holder').style.display = 'block';
		client.beginDuoGame(data);
	});

	/* The server sends the client an update on the adversary's arena. */
	socket.on('updateAdversaryArena', data => {
		console.log('Received message: update adversary arena');
		client.receiveAdversaryArenaUpdate(data);
	});

	/* The server sends the next batch of pieces. */
	socket.on('nextBatch', data => {
		console.log('Received message: next batch');
		client.receiveNextBatch(data);
	});

	/* The server sends the new position of the adversary piece. */
	socket.on('updateAdversaryPiece', data => {
		console.log('Received message: update adversary piece');
		client.receiveAdversaryPiece(data);
	});

	/* The server indicates that the game must be stopped. */
	socket.on('endDuoGame', data => {
		console.log('Received message: end duo game');
		client.endDuoGame();
		window.location.replace(location.protocol + '//' + document.domain + ':' + location.port + '/duo');
	});

	/* The server has sent a pause event in duo mode. */
	socket.on('pause', data => {
		console.log('Received message: pause');
		client.togglePause();
	});

	/* The server notifies that the other player has lost (duo mode). */
	socket.on('lost', data => {
		console.log('Received message: lost');
		client.adversaryLost(data);
	})

	/* The other player has decided to start over. */
	socket.on('startedAgain', data => {
		console.log('Received message: started again');
		client.adversaryStartAgain(data);
	});

	/* The adversary updates the selection of one of its selectors. */
	socket.on('updateSelector', data => {
		console.log('Received message: update selector');
		client.updateSelector(data);
	});

	/* The adversary updates its state. */
	socket.on('updateState', data => {
		console.log('Received message: update state');
		client.updateState(data);
	});

	/* The adversary updates the content of an input box. */
	socket.on('updateInputBox', data => {
		console.log('Received message: update input box');
		client.updateInputBox(data);
	});
});

function setup() {
	/* Find out the mode by looking at the URL. */
	let pathsArray = window.location.pathname.split('/');
	mode = pathsArray[pathsArray.length - 1];

	/* The size of the canvas depends on the game mode. */
	let canvasWidth = mode == 'solo' ? 400 : 800;
	let canvasHeight = 540;
	let canvas = createCanvas(canvasWidth, canvasHeight);

	/* Move the canvas to the appropriate div element. */
	canvas.parent('canvas-holder');

	/* Create the client. */
	client = new Client(canvasWidth, canvasHeight, mode=mode);
}

function draw() {
	background(0);

	client.update();
	client.display();
}

function keyPressed() {
	client.keyPressed(keyCode, key);
	return false;
}

function keyReleased() {
	client.keyReleased(keyCode, key);
	return false;
}
