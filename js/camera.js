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
		let whalf = game.width >> 1;
		let hhalf = game.height >> 1;
		if(this.pinned != null){
			let point = this.pinned.getPosition();
			let position = this.getPosition();

			// Distances.
			let dx = point.getX() - position.getX();
			let dy = point.getY() - position.getY();

			if((dx * dx + dy * dy) > 10000){
				this.velocity.x += dx / 100;
				this.velocity.y += dy / 100;
			}

		}else{
			this.velocity.x += (game.getKey(68) - game.getKey(65))|0;
			this.velocity.y += (game.getKey(66) - game.getKey(67))|0;
		}
		this.getVelocity().multiply(0.89);
		p.addVector(this.getVelocity());
		p.clamp(whalf, 1024 * (game.chunksLimit + 1) - whalf, hhalf, 1024 - hhalf);
	};

	drawGUI(game, ctx){
		// var entity = this.pinned;
		// var life = Math.round(entity.currentLife * 4 / entity.life);
		// var heart = game.getTexture("heart");
		// for(var l = 0; l < life; l++){
		// 	for(var h = 0; h < 2; h++){
		// 		ctx.drawImage(heart, 8 * h, 0, 8, 16, 10 + 20 * l + h * 8, 10, 8, 16);
		// 	}
		// }
	};
}
