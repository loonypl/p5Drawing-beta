// Ⓒ Chris K.
// p5Drawing, BETA release 0.0.2, 12:41 Poland, Warsaw.

function Cursor() {

	this.eraser = false;

	this.update = function () {
		if (this.eraser == false) {
			push();
			noFill();
			stroke(int(transparencyinput.value()));
			strokeWeight(1);
			ellipse(mouseX, mouseY, brushslider.value());
			pop();
		} else {
			push();
			colorMode(HSB);
			noFill();
			stroke(0, 100, 90);
			strokeWeight(1);
			ellipse(mouseX, mouseY, brushslider.value());
			pop();
		}
	}

	this.asEraser = function (bool) {
		this.eraser = bool;
	}

}
