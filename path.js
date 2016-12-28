function Path (x, y, transparency, weight) {
	
	this.x = x;
	this.y = y;
	this.w = weight;
	this.t = transparency;

	this.update = function () {
		push();
		colorMode(HSB);
		noFill();
		stroke(this.t);
		strokeWeight(this.w);
		beginShape(POINTS);
		vertex(this.x,  this.y);
		endShape();
		pop();
	}

}