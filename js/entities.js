class Entity{
	constructor(x, y){
		this.guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });

		/* Life */
		this.life   = 100;
		this.currentLife = 100;

		/* Texture */
		this.currentSprite  = 0;
		this.textureName = 1;

		/* Movement */
		this.numOfJumps   = 1;
		this.jumpsDone    = 0;
		this.position 		= new Vector2d(x, y - 62);
		this.velocity 		= new Vector2d(0, 0);
	};

	/* Constant functions */
	getGUID(){return this.guid; };
	/* Textures functions */
	setTexture(n){ this.textureName = n; };
	setSprite(i){
		if(this.currentSprite !== i){
			this.y += (this.getHeight() - this.sizes[i * 2 + 1]) / 2;
			this.currentSprite = i;
		}
	};

	/* Movement functions */
	getPosition()		{ return this.position; };
	getVelocity()		{ return this.velocity; };
	setJumpsDone(n)	{ this.jumpsDone = n; };

	/* Life functions */
	getLife()	{ return this.currentLife; };
	setLife(n){ this.currentLife = n; };
	heal(n)		{ this.currentLife = Math.min(100, n + this.currentLife); };
	damage(n)	{ this.currentLife = Math.max(0, this.currentLife - n) };
};

class Player extends Entity{
	constructor(x, y){
		/* Based on the entity class */
		super(x, y);

		/* Camera */
		this.camera = false;
	}

	/* Constant TODO: ENTITIES CAN'T HAVE CONSTANT. */
	/* Collision Box */
	getWidth(){ return 30; };
	getHeight(){ return 60; };

	/* Main functions */
	update(game){
		if(game.ticks  % 10 === 0){ this.heal(10); }
		var vel = this.getVelocity();

		vel.addY(1.9); // GRAVITY
		vel.addX((game.getKey(68) - game.getKey(65)) * 0.23);
		if(game.getKey(87) == 1 && this.jumpsDone < this.numOfJumps){
			this.jumpsDone++;
			vel.addY(-30);
		}
		this.checkCollision(game);
		this.getPosition().addVector(vel);
	};

	checkCollision(game){
		var hw = this.getWidth() / 2, hh = this.getHeight() / 2;
		var yVel = this.getVelocity().getY();
		var xVel = this.getVelocity().getX();
		var y = this.getPosition().getY();
		var x = this.getPosition().getX();

		// Vertical Collision
		var yabs = Math.abs(yVel);
		var yDirection = (yabs / yVel) | 0;
		var ft = y + yVel + hh * yDirection;
		var ftPos = ft >> 5;
		var lft = game.getBlockInChunk((x - hw) >> 5, ftPos);
		var mid = game.getBlockInChunk(x >> 5, ftPos);
		var rgt = game.getBlockInChunk((x + hw) >> 5, ftPos);
		if(lft.isSolid() | mid.isSolid() | rgt.isSolid()){
			if(this.velocity.getY() > 0){ this.jumpsDone = 0; }
			this.getVelocity().addY((ftPos << 5) - ft + 32 * (yDirection>>1&1));
		}
		mid.touchedVertical(this);

		// Horizontal Collision
		var xabs = Math.abs(xVel);
		var xDirection = (xabs / xVel) | 0;
		var rs = x + xVel + hw * xDirection;
		var rsPos = rs >> 5;
		var top = game.getBlockInChunk(rsPos, (y - hh) >> 5);
		var mid = game.getBlockInChunk(rsPos, y >> 5);
		var btm = game.getBlockInChunk(rsPos, (y + hh) >> 5);
		if(top.isSolid() | mid.isSolid() | btm.isSolid()){
			this.getVelocity().addX((rsPos << 5) - rs + 32 * (xDirection>>1&1));
		}
		mid.touchedHorizontal(this);
	};

	draw(game, ctx, xCamera, yCamera){
		var w = this.getWidth(), h = this.getHeight();
		var p = this.getPosition();
		var x = (p.getX() - xCamera - w / 2) | 0, y = (p.getY() - yCamera - h / 2) | 0;
		var texture = game.getTexture(this.textureName);
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.rect(x, y, w, h);
		ctx.stroke();
		ctx.closePath();

		var tx = p.getX() - xCamera;
		var ty = p.getY() - yCamera;
		ctx.beginPath();
		ctx.moveTo(tx, ty);
		ctx.lineTo(tx + this.getVelocity().getX() * 15, ty);
		ctx.stroke();
		ctx.closePath();

		var vl = this.getVelocity();
		game.writeFont(ctx, 6, 8, 8, "abcdefghijklmnopqrstuvwxyz+-.,:1234567890", "vx: " + (vl.getX()|0) + "px", x, y - 20);
		game.writeFont(ctx, 6, 8, 8, "abcdefghijklmnopqrstuvwxyz+-.,:1234567890", "vy: " + (vl.getY()|0) + "px", x, y - 10);
	};
};
