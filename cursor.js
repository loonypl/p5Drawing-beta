// © Chris K.
// p5Drawing, BETA release 0.0.2, 12:41 Poland, Warsaw.

function Cursor() {

	this.eraser = false;
	this.shape = 'Circle';

	this.update = function () {
		if (this.eraser == false) {
			if (this.shape == 'Circle') {
				push();
				noFill();
				stroke(int(transparencyinput.value()));
				strokeWeight(1);
				ellipse(mouseX, mouseY, brushslider.value());
				pop();
			} else if (this.shape == 'Square') {
				push();
				noFill();
				stroke(int(transparencyinput.value()));
				strokeWeight(1);
				translate(- brushslider.value()/2, - brushslider.value()/2);
				rect(mouseX, mouseY, brushslider.value(), brushslider.value());
				pop();
			} else if (this.shape == 'Triangle') {
				push();
				noFill();
				stroke(int(transparencyinput.value()));
				strokeWeight(1);
				triangle(mouseX - brushslider.value()/2, mouseY, mouseX, mouseY - brushslider.value(), mouseX + brushslider.value()/2, mouseY);
				pop();
			}
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

	this.setShape = function (shape) {
		this.shape = shape;
	}

	this.getShape = function () {
		return this.shape;
	}

}