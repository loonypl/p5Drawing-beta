// © Chris K.
// p5Drawing, BETA release 0.0.3, 21:28 Poland, Warsaw.

function Path (x, y, transparency, weight, colour, shape) {
	
	this.x = x;
	this.y = y;
	this.w = weight;
	this.t = transparency;
	this.s = shape;

	this.coloursplit = split(colour, ', ');
	this.c = color(int(this.coloursplit[0]), int(this.coloursplit[1]), int(this.coloursplit[2]), transparency);

	this.update = function () {
		if (this.s == 'Circle') {
			push();
			colorMode(RGB);
			fill(this.c);
			noStroke();
			ellipse(this.x, this.y, this.w, this.w);
			pop();
		} else if (this.s == 'Square') {
			push();
			colorMode(RGB);
			fill(this.c);
			noStroke();
			translate(- weight/2, - weight/2);
			rect(this.x, this.y, weight, weight);
			pop();
		} else if (this.s == 'Triangle') {
			push();
			colorMode(RGB);
			fill(this.c);
			noStroke();
			triangle(this.x - weight/2, this.y, this.x, this.y - weight, this.x + weight/2, this.y);
			pop();
		}
	}

}
