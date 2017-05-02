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
	getModule(){ return Math.sqrt(this.getX() * this.getX() + this.getY() * this.getY()); };
	getRotation(){ return Math.atan2(this.getY(), this.getX()); };
	getXDirection(){ return Math.round(this.x / Math.abs(this.x)); }
	getDotProduct(v){ return Math.abs(v.y * this.y + v.x * this.x) / (this.getModule() * v.getModule()); };
	addVector(v){ this.x += v.x; this.y += v.y; };
	mltVector(v){ this.x *= v.x; this.y *= v.y; };
	multiply(n){ this.x *= n; this.y *= n; }
	draw(ctx, x, y){
		var dir = this.getDirection();
		var dis = this.getModule();
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + this.getX(), y + this.getY());
		ctx.stroke();
		ctx.closePath();
	};
}
