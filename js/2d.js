class Vector2d{
	constructor(x, y){
		this.x = x;
		this.y = y;
	};

	/* X Coordinate */
	getX(){ return this.x; };
	setX(x){ this.x = x; };
	addX(x){ this.x += x; };
	multX(x){ this.x *= x; };
	clampX(a,b){ this.x = this.x > b ? b : this.x < a ? a : this.x; };

	/* Y Coordinate */
	getY(){ return this.y; };
	setY(y){ this.y = y; };
	addY(y){ this.y += y; };
	multY(y){ this.y *= y; };
	clampY(a,b){ this.y = this.y > b ? b : this.y < a ? a : this.y; };

	/* X/Y Coordinates */
	set(i, j){ this.setX(i); this.setY(j); };
	clamp(a,b,c,d){ this.clampX(a,b); this.clampY(c,d); };
	
	/* Vector properties */
	getLength(){ return Math.sqrt(this.getX() * this.getX() + this.getY() * this.getY()); };
	getAngle() { return Math.atan2(this.getY(), this.getX()); };
	getDotProduct(vec){
		let x0 = this.getX(), y0 = this.getY();
		let x1 = vec.getX(), y1 = vec.getY();
		let length = Math.sqrt((x0 * x0 + y0 * y0)*(x1 * x1 + y1 * y1));
		return Math.abs(y0 * y1 + x0 * x1) / length;
	};
	getXDirection(){ return Math.round(this.x / Math.abs(this.x)); };
	
	/* Transform vector. */
	addVector(vec)	{ this.x += vec.x; this.y += vec.y; };
	mltVector(vec)	{ this.x *= vec.x; this.y *= vec.y; };
	multiply(n0, n1){ this.x *= n0; this.y *= n1; };
	sum(n0, n1)	{ this.x += n0; this.y += n1; };
	
	
	draw(ctx, x, y){
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + this.getX(), y + this.getY());
		ctx.stroke();
		ctx.closePath();
	};
}
