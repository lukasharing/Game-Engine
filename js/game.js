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
		if(chunk !== undefined){
			chunk.setBlock(this, a % 32, b, c);
		}
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
		this.addLevel(0, "gfx/map/map0.png");

		// INIT ENTITIES
		var player = new Player(100, 200);
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

		if(camera.pinned != null){
			camera.drawGUI(this, ctx);
		}
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
				//chunk.generate(this, 20);
				chunk.preGenerate(this, this.levels[0]);
				this.chunks[v] = chunk;
			}
			chunk.draw(this, ctx);
		}
	};
}
