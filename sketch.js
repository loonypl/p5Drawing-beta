// TODO: changing brush style, changing brush color.
// DONE FROM TODO: Show message while saving/showing/clearing,
//				   changing brush weight, changing brush transparency,
//				   undo (in feature - add more moves to undo), earser.

// global vars
var database;
var cursor;
var drawPath = false;
var paths = [];
var pathsUndo = [];
var backgroundColor = 0;
var erase = false;

// containers
var canvascontainer;
var optionscontainer;
var savescontainer;
var savesheader;
var messageapplet;

// canvases, etc.
var canvas;
var keyinput;
var brushslider;
var transparencyinput;

function setup() {
	initFireBase();
	database = firebase.database();
	var ref = database.ref('datas');
	ref.on('value', listSaves, sendError);

	function listSaves(data) {
		savescontainer.html('');
		var saves = data.val();
		var keys = 0;
		if (saves != null) keys = Object.keys(saves);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var save = createA('#', key);
			save.mouseClicked(showDrawing);
			save.parent(savescontainer);
			var br = createElement('br');
			br.parent(savescontainer);
		}
	}

	function sendError(e) {
		console.error(e);
	}

	cursor = new Cursor();

	canvascontainer = createElement('canvascontainer');
	canvas = createCanvas(window.innerWidth, 600);
	canvas.parent(canvascontainer);
	canvas.mousePressed(startPath);
	canvas.mouseReleased(endPath);

	function startPath() {
		drawPath = true;
		pathsUndo = [];
	}

	function endPath() {
		drawPath = false;
	}

	optionscontainer = createElement('optionscontainer');

	addStyles(optionscontainer, [
		'display: block',
		'font-family: sans-serif'
	]);

	savesheader = createElement('savesheader');
	addStyles(savesheader, [
		'display: block',
		'margin-left: 10px'
	]);

	var saveHeader = createP('Saves:');
	saveHeader.parent(savesheader);
	addStyles(saveHeader, [
		'display: block'
	]);

	savescontainer = createElement('savescontainer');
	addStyles(savescontainer, [
		'display: block',
		'margin-left: 15px'
	]);

	var textKey = createP('Save name:');
	textKey.parent(optionscontainer);
	addStyles(textKey, [
		'display: inline-block',
		'margin-left: 10px',
		'border-bottom: 1px solid #5DABB8'
	]);

	keyinput = createInput('drawing' + int(random(255)));
	keyinput.parent(optionscontainer);
	addStyles(keyinput, [
		'display: inline-block',
		'border: 2px solid #5DABB8',
		'margin: 10px'
	]);

	var border = createP('|');
	border.parent(optionscontainer);
	addStyles(border, [
		'display: inline-block',
		'margin-right: 10px'
	]);

	var eraser = createButton('Toggle Eraser');
	eraser.parent(optionscontainer);
	addStyles(eraser, [
		'display: inline-block',
		'border: 2px solid #404040',
		'margin-right: 5px'
	]);
	eraser.mouseClicked(eraserToggle);

	function eraserToggle() {
		if (erase == true) {
			erase = false;
			cursor.asEraser(false);
		}
		else if (erase == false) {
			erase = true;
			cursor.asEraser(true);
		}

		if (messageapplet) messageapplet.remove();

		if (erase == true) {
			createMessage('Toggled eraser on');
		} else if (erase == false) {
			createMessage('Toggled eraser off');
		}

		function createMessage(msg) {
			messageapplet = createElement('showmessage');
			addStyles(messageapplet, [
				'position: absolute',
				'display: block',
				'top: 0',
				'left: 0',
				'height: 50px',
				'width: auto',
				'background: #404040',
				'border-left: 5px solid #404040',
				'border-right: 5px solid #404040',
				'text-align: center'
			]);
			var showText = createP(msg);
			addStyles(showText, [
				'display: block',
				'margin-top: 15px',
				'font-size: 16px',
				'font-family: sans-serif',
				'color: #FFFFFF'
			]);
			showText.parent(messageapplet);
			setTimeout(removeMessage, 5000);

			function removeMessage() {
				messageapplet.remove();
			}
		}
	}

	var undo = createButton('Undo last move');
	undo.parent(optionscontainer);
	addStyles(undo, [
		'display: inline-block',
		'border: 2px solid #539987',
		'margin-right: 5px'
	]);
	undo.mouseClicked(undoPath);

	function undoPath() {
		for (var xl = 0; xl < pathsUndo.length; xl++) {
			for (var yl = 0; yl < paths.length; yl++) {
				if (paths[yl].x == pathsUndo[xl].x && paths[yl].y == pathsUndo[xl].y) {
					paths.splice(yl, 1);
				}
			}
		}

		if (messageapplet) messageapplet.remove();

		createMessage('Undo of last move');

		function createMessage(msg) {
			messageapplet = createElement('showmessage');
			addStyles(messageapplet, [
				'position: absolute',
				'display: block',
				'top: 0',
				'left: 0',
				'height: 50px',
				'width: auto',
				'background: #404040',
				'border-left: 5px solid #404040',
				'border-right: 5px solid #404040',
				'text-align: center'
			]);
			var showText = createP(msg);
			addStyles(showText, [
				'display: block',
				'margin-top: 15px',
				'font-size: 16px',
				'font-family: sans-serif',
				'color: #FFFFFF'
			]);
			showText.parent(messageapplet);
			setTimeout(removeMessage, 5000);

			function removeMessage() {
				messageapplet.remove();
			}
		}
	}

	var clear = createButton('Clear');
	clear.parent(optionscontainer);
	addStyles(clear, [
		'display:  inline-block',
		'border: 2px solid #DF6262'
	]);
	clear.mouseClicked(clearDrawing);

	function clearDrawing() {
		paths = [];
		keyinput.value('drawing' + int(random(255)));

		if (messageapplet) messageapplet.remove();

		createMessage('Drawing place cleared');

		function createMessage(msg) {
			messageapplet = createElement('showmessage');
			addStyles(messageapplet, [
				'position: absolute',
				'display: block',
				'top: 0',
				'left: 0',
				'height: 50px',
				'width: auto',
				'background: #404040',
				'border-left: 5px solid #404040',
				'border-right: 5px solid #404040',
				'text-align: center'
			]);
			var showText = createP(msg);
			addStyles(showText, [
				'display: block',
				'margin-top: 15px',
				'font-size: 16px',
				'font-family: sans-serif',
				'color: #FFFFFF'
			]);
			showText.parent(messageapplet);
			setTimeout(removeMessage, 5000);

			function removeMessage() {
				messageapplet.remove();
			}
		}
	}

	var save = createButton('Save');
	save.parent(optionscontainer);
	addStyles(save, [
		'display: inline-block',
		'border: 2px solid #72BD2B',
		'margin-left: 5px',
		'font-family: sans-serif'
	]);
	save.mouseClicked(saveDrawing);

	function saveDrawing() {
		var ref = database.ref('datas');
		var save = {
			key : keyinput.value(),
			path : paths
		};
		var res = ref.push(save);

		if (messageapplet) messageapplet.remove();

		createMessage("Saved as: '" + save.key + "'");

		function createMessage(msg) {
			messageapplet = createElement('savemessage');
			addStyles(messageapplet, [
				'position: absolute',
				'display: block',
				'top: 0',
				'left: 0',
				'height: 50px',
				'width: auto',
				'background: #404040',
				'border-left: 5px solid #404040',
				'border-right: 5px solid #404040',
				'text-align: center'
			]);
			var savedText = createP(msg);
			addStyles(savedText, [
				'display: block',
				'margin-top: 15px',
				'font-size: 16px',
				'font-family: sans-serif',
				'color: #FFFFFF'
			]);
			savedText.parent(messageapplet);
			setTimeout(removeMessage, 10000);

			function removeMessage() {
				messageapplet.remove();
			}
		}
	}

	var border2 = createP('|');
	border2.parent(optionscontainer);
	addStyles(border2, [
		'display: inline-block',
		'margin-right: 10px',
		'margin-left: 10px'
	]);

	var brushText = createP('Brush size:');
	brushText.parent(optionscontainer);
	addStyles(brushText, [
		'display: inline-block'
	]);

	brushslider = createSlider(1, 30, 15, 1);
	brushslider.parent(optionscontainer);
	addStyles(brushslider, [
		'display: inline-block'
	]);

	var border3 = createP('|');
	border3.parent(optionscontainer);
	addStyles(border3, [
		'display: inline-block',
		'margin-right: 10px',
		'margin-left: 5px'
	]);

	var colourText = createP('Brush transparency:');
	colourText.parent(optionscontainer);
	addStyles(colourText, [
		'display: inline-block',
		'margin-right: 5px'
	]);

	transparencyinput = createInput('255');
	transparencyinput.parent(optionscontainer);
	addStyles(transparencyinput, [
		'display: inline-block',
		'border: 2px solid #404040',
		'margin-left: 5px',
		'width: 50px',
		'text-align: center'
	]);

}

function draw() {
	background(backgroundColor);
	cursor.update();
	if (drawPath == true) {
		if (erase == false) {
			paths.push({ x: mouseX, y: mouseY, weight: brushslider.value(), transparency: int(transparencyinput.value()) });
			pathsUndo.push({ x: mouseX, y: mouseY, weight: brushslider.value(), transparency: int(transparencyinput.value()) });
		} else {
			for (var i = 0; i < paths.length; i++) {
				if (p5.Vector.dist(createVector(paths[i].x, paths[i].y), createVector(mouseX, mouseY)) < (brushslider.value()/2)) {
					paths.splice(i, 1);
					print('yes');
				}
			}
		}
	}
	for (var i = 0; i < paths.length; i++) {
		new Path(paths[i].x, paths[i].y, paths[i].transparency, paths[i].weight).update();
	}

}

function addStyles(element, styles) {
	for (var i = 0; i < styles.length; i++) {
		element.style(styles[i]);
	}
}

function initFireBase() {
	var config = {
		apiKey: "AIzaSyBdOScGCEmfWbPBtSqOVHSAYVdoJfc85Gk",
		authDomain: "p5drawing-5d016.firebaseapp.com",
		databaseURL: "https://p5drawing-5d016.firebaseio.com",
		storageBucket: "p5drawing-5d016.appspot.com",
		messagingSenderId: "312182152336"
	};
	firebase.initializeApp(config);
}

function showDrawing() {
	var key = this.html();
	var ref = database.ref('datas/' + key);
	ref.once('value', initDrawing, sendError);

	function initDrawing(data) {
		var val = data.val();
		keyinput.value(val.key);
		paths = val.path;

		if (messageapplet) messageapplet.remove();

		createMessage("Loaded save with name: '" + val.key + "' and key: '" + key + "'");
	}

	function sendError(e) {
		console.error(e);
	}

	function createMessage(msg) {
		messageapplet = createElement('showmessage');
		addStyles(messageapplet, [
			'position: absolute',
			'display: block',
			'top: 0',
			'left: 0',
			'height: 50px',
			'width: auto',
			'background: #404040',
			'border-left: 5px solid #404040',
			'border-right: 5px solid #404040',
			'text-align: center'
		]);
		var showText = createP(msg);
		addStyles(showText, [
			'display: block',
			'margin-top: 15px',
			'font-size: 16px',
			'font-family: sans-serif',
			'color: #FFFFFF'
		]);
		showText.parent(messageapplet);
		setTimeout(removeMessage, 10000);

		function removeMessage() {
			messageapplet.remove();
		}
	}
}