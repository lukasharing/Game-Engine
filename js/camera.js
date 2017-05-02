class Camera{
	constructor(x, y, zoom){
		this.zoom = zoom;
		this.pinned = null;
		this.position = new Vector2d(x, y);
		this.velocity = new Vector2d(0, 0);
	};

	getZoom(){ return this.zoom; };
	getPosition(){ return this.position; };
	getVelocity(){ return this.velocity; };
	pinTo(a){ this.pinned = a; };

	update(game){
		var p = this.getPosition();
		if(this.pinned !== null){
			var whalf = game.width >> 1, hhalf = game.height >> 1;
			var point = this.pinned.getPosition(), position = this.getPosition();
			var dx = point.getX() - position.getX(), dy = point.getY() - position.getY();
			if((dx * dx + dy * dy) > 10000){
				this.velocity.x += dx / 100;
				this.velocity.y += dy / 100;
			}

			this.getVelocity().multiply(0.79);
			p.addVector(this.getVelocity());
			p.clamp(whalf, 32 * 32 * (game.chunksLimit + 1) - whalf, hhalf, 32 * 32 - hhalf);
		}
	};

	drawGUI(game, ctx){
		var entity = this.pinned;
		var life = Math.round(entity.currentLife * 4 / entity.life);
		var heart = game.getTexture("heart");
		for(var l = 0; l < life; l++){
			for(var h = 0; h < 2; h++){
				ctx.drawImage(heart, 8 * h, 0, 8, 16, 10 + 20 * l + h * 8, 10, 8, 16);
			}
		}
	};
}
