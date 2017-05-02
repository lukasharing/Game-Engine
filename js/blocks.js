class Block{
	constructor(){
		this.nearblocks = 0x10;
	};

	/* Near blocks */
	toggleNear(a, i, j)	{ this.nearblocks ^= (-a ^ this.nearblocks) & 1 << (i + j * 3); };
	/*getNear()						{ return this.nearblocks; };
	setNear(n)					{ this.nearblocks = n; };*/
}

class Air extends Block{
	constructor(){
		super();
	};

	/* Texture  */
	getTexture(){ return null; };

	/* Constants */
	getType(){ return 0; };
	isSolid(){ return false; };

	/* Event when touching the block. */
	touchedHorizontal(e){};
	touchedVertical(e){
		e.getVelocity().multiply(0.97);
	};
	/* Global Events. */
	update(game, x, y){};
	draw(ctx, x, y, z){};
}

class Ground extends Block{
	constructor(){
		super();
	};

	/* Texture */
	getTexture(){ return (this.nearblocks<<5)|this.getType(); };

	/* Constants */
	getType(){ return 1; };
	isSolid(){ return true; };

	/* Event when touching the block. */
	touchedHorizontal(e){
		//e.getVelocity().multX(0.90);
	};
	touchedVertical(e){
		e.getVelocity().multX(0.90);
		e.getVelocity().multY(0.93);
	};


	/* Global Events. */
	update(game, x, y){};
	draw(game, ctx, x, y){
			var t = game.getTexture(this.getTexture());
			ctx.drawImage(t, x, y);
	};
}

class Spikes extends Block{
	constructor(){
		super();
	};

	/* Texture */
	getTexture(){ return 2; };

	/* Constants */
	getType(){ return 2; };
	isSolid(){ return false; };

	/* Event when touching the block. */
	touchedHorizontal(e){};
	touchedVertical(e){
		e.jumpsDone = 0;
		e.getVelocity().multiply(0.89);
		e.getVelocity().setY(-10);
		e.damage(10);
	};

	/* Global Events. */
	update(game, x, y){};
	draw(game, ctx, x, y){
		var t = game.getTexture(this.getTexture());
		ctx.drawImage(t, x, y);
	};
	toggleNear(a, i, j){ super.toggleNear(a, i, j); };
}

class Rock extends Block{
	constructor(){
		super();
	};

	/* Texture */
	getTexture(){ return (this.nearblocks<<5)|this.getType(); };

	/* Constants */
	getType(){ return 3; };
	isSolid(){ return true; };

	/* Event when touching the block. */
	touchedHorizontal(e){};
	touchedVertical(e){};

	/* Global Events. */
	update(game, x, y){};
	draw(game, ctx, x, y){
			var t = game.getTexture(this.getTexture());
			ctx.drawImage(t, x, y);
	};
}

class Stair extends Block{
	constructor(){
		super();
	};

	/* Constants */
	getType(){ return 4; };
	isSolid(){ return 0; };

	/* Texture */
	getTexture(){ return 4; };

	/* Event when touching the block. */
	touchedHorizontal(e){};
	touchedVertical(e){
		e.getVelocity().setY(0);
	};

	/* Global Events. */
	update(game, x, y){};
	draw(game, ctx, x, y){
		var t = game.getTexture(this.getTexture());
		ctx.drawImage(t, x, y);
	};
}
