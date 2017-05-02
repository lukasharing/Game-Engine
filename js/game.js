var FONT = {
	mario: {
		alphabet: "abcdefghijklmnopqrstuvwxyz+-.,:1234567890",
		width: 8,
		height: 8
	},
};

class Game{
	constructor(){
		/* Game */
		this.gameTicks  = 0;

		/* Canvas */
		this.canvas 	= null;
		this.width  	= 0;
		this.height 	= 0;
		this.context 	= null;

		/* Textures */
		this.textures 			= [];
		this.loadedTextures = 0;
		this.totalTextures  = 0;

		/* World */
		this.chunks  			= [];
		this.levels 			= [];
		this.chunksLimit 	= 3;
		this.block_AIR 		= new Air();

		/* Camera */
		this.camera = new Camera(0, 0, 1);

		/* Keys */
		this.keys = [];

		/* Entities */
		this.totalEntities 	= 10;
		this.entities 			= [];

	};

	/* Canvas functions */
	getWidth(){ return this.width; };
	getHeight(){ return this.height; };
	setSizes(w, h){
		this.width  = this.canvas.width = w;
		this.height = this.canvas.height = h;
	};
	getContext(){ return this.context; };
	setContext(n){ this.context = n; };

	/* Camera functions */
	getCamera(){ return this.camera; };

	/* World functions */
	/* It returns a chunk if it exists conversely, it will create the new chunk. */
	getChunk(i){ return (i < 0 || i > this.chunksLimit) ? undefined : this.chunks[i]; };

	/* It returns a block based on the global x, y position. */
	getBlockInChunk(a, b){
		var chunk = this.getChunk(a >> 5);
		return chunk !== undefined ? chunk.getBlock(a % 32, b) : null;
	};

	/* It sets a block based on the global x, y position. */
	setBlockInChunk(a, b, c){
		var chunk = this.getChunk(a >> 5);
		return (chunk !== undefined) ? chunk.setBlock(this, a % 32, b, c) : null;
	};

	addLevel(n, u){
		var img = new Image();
		var self = this;
		img.onload = function(){
			var ftr = $("#filter")[0];
			var ctx = ftr.getContext("2d");
			var wdt = ftr.width = img.width, hgt = ftr.height = img.height;
			ctx.drawImage(img, 0, 0);
			var imd = ctx.getImageData(0, 0, wdt, hgt);
			var ttl = hgt * wdt, lvl = [];
			for(var d = 0; d < ttl; d++){
					lvl[d] = imd.data[d * 4];
			}
			self.levels[n] = lvl;
		};
		img.src = u;
	};
	getLevel(i){ return this.levels[i]; };

	/* Keys functions */
	getAllKeys(){ return this.keys; };
	setKey(k, b){
		if(k instanceof Array){
			for(var i = 0; i < k.length; i++){
				this.keys[k[i]] = b;
			}
		}else{
			this.keys[k] = b;
		}
	};
	getKey(k){ return this.keys[k] | 0; };

	/* Entities functions */
	addEntity(e, n)	{ this.entities[n || e.getGUID()] = e; };
	getEntity(n)		{ return this.entities[n]; };
	removeEntity(n)	{ delete this.entities[n]; };

	/*
		Texture functions
		* You can add new ones.
		* You can delete from cache.
		* You can merge textures.
		* TODO: Coloring textures.
		* TODO: Dynamic Texture
	*/
	getTexture(n){ return this.textures[n]; };
	addTexture(n, u){
		var img = new Image();
		var self = this;
		this.totalTextures++;
		img.onload = function(){
			self.textures[n] = img;
			self.loadedTextures++;
		};
		img.onerror = function(){ self.totalTextures--; };
		img.src = u;
	};
	mergeTextureBlock(c){
		if(c.getType() <= 0) return;
		var name = c.getTexture();
		if(this.getTexture(name) == undefined){
				var ftr = $("#filter")[0];
				ftr.width = ftr.height = 32;
				var ctx = ftr.getContext("2d");
				var texture = this.getTexture(c.getType()), near = name >> 5;
				for(var w = 0; w < 2; w++){
					var xp = w << 4;
					var xm = (((near>>3|w)&1)<<(~near>>5&w))<<4;
					for(var h = 0; h < 2; h++){
						var yp = h << 4;
						var ys = xm + (((near>>1|h)&1)<<(~near>>7&h))*0x30;
						ctx.drawImage(texture, ys, 0, 16, 16, xp, yp, 16, 16);
					}
				}
				var img = document.createElement('img');
				img.src = ftr.toDataURL();
				this.textures[name] = img;
				this.loadedTextures++;
				this.totalTextures++;
		}
	};
	writeFont(ctx, tex, sw, sh, dcn, txt, x, y){
		var tt = this.getTexture(tex);
		var spl = txt.split('');
		for(var l = 0; l < spl.length; l++){
			var il = dcn.indexOf(spl[l]);
			if(il > -1){
				ctx.drawImage(tt, sw * il, 0, sw, sh, x + l * sw, y, sw, sh);
			}
		}
	};


	/* Main functions */
	init(canvas, w, h){
		var elm = this.canvas = $(canvas)[0];
		this.setSizes(w, h);
		this.setContext(elm.getContext("2d"));

		this.addTexture(1, "gfx/block/floor.png");
		this.addTexture(2, "gfx/block/spikes.png");
		this.addTexture(3, "gfx/block/rock_spds.png");
		this.addTexture(4, "gfx/block/stair.png");
		this.addTexture(6, "gfx/font/small_mario.png");
		this.addTexture("player", "data:image/png;base64,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");
		this.addTexture("heart", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAMAAABA3o1rAAAAGFBMVEUAAADAwMAgICBAQEDg4OCAgICgoKD///+KtIecAAAACHRSTlP/////////AN6DvVkAAACWSURBVHjahdBBDgMhDENRxyFw/xvXBIsuitRoFKT5bxYM1lpD4/07UCGJCOgYLxCIMYLcG9HvNN46uqtpWyBJP9iAaupnM3YHmGejwZ0DVNTOFijOb5+sBh6DrPBUPgFz+vvkA6yChDuqL3F7biABCXXs3qKJr7kkklm9/PPgOyoKtBBHdxP/pQYW7leoG1i4X6Fg8Gc+y44HWQmnjxIAAAAASUVORK5CYII=");
		this.addLevel(0, "gfx/map/map0.png");

		// INIT ENTITIES
		var player = new Player(400, 300);
		this.addEntity(player, "player");

		var p0 = this.getEntity("player");
		p0.camera = true;
		this.getCamera().pinTo(p0);
		(function(self){setInterval(function(){self.run()}, 100/6)})(this);
	};

	run(){
		if(this.loadedTextures == this.totalTextures){
				this.render();
				this.update();
				this.gameTicks++;
		}
	};

	update(){
		var allEntities = this.entities;

		for(var entityName in allEntities){
			var entity = allEntities[entityName];
			if(entity.getLife() == 0){
					delete allEntities[entityName];
			}else{
				entity.update(this);
			}
		}
		this.getCamera().update(this); // Update Camera
	};

	/* Render by parts */
	render(){
		var ctx = this.getContext();
		ctx.beginPath()
		ctx.fillStyle = "#55b4ff";
		ctx.rect(0, 0, this.getWidth(), this.getHeight());
		ctx.fill();

		this.renderChunks(ctx); // Generate and Draw the world.
		var allEntities = this.entities;
		var camera = this.getCamera();
		var xCamera = camera.position.getX() - (this.getWidth() >> 1);
		var yCamera = camera.position.getY() - (this.getHeight() >> 1);

		for(var entityName in allEntities){
			var entity = allEntities[entityName];
			entity.draw(this, ctx, xCamera, yCamera);
		}

		camera.drawGUI(this, ctx);
	};

	renderChunks(ctx){
		/*
			It calculates the boundaries of the camera and translate it into idChunks,
			then draw each chunks or create them.
		*/
		var camera = this.getCamera();
		var cPosit = camera.getPosition();
		var xCamera = cPosit.getX(), whCamera = this.getWidth() >> 1;
		var x0 = Math.max(0, (xCamera - whCamera) >> 10);
		var x1 = Math.min(this.chunksLimit, (xCamera + whCamera) >> 10);
		for(var v = x0; v <= x1; v++){
			var chunk = this.getChunk(v);
			if(chunk == undefined){
				chunk = new Chunk(v);
				chunk.generate(this, 20);
				//chunk.preGenerate(this, this.levels[0]);
				this.chunks[v] = chunk;
			}
			chunk.draw(this, ctx);
		}
	};
}
