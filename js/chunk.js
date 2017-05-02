class Chunk{
	constructor(i){
		this.indexChunk = i;
		this.generated = false;
		this.blocks = [];
	};


	setGenerated(b)	{ this.generated = b; };
	isGenerated()		{ return this.generated; };

	isInChunk(a, b){ return (a >= 0 && a < 32) && (b >= 0 && b < 32); }
	setBlock(g, x, y, b){
		if(this.isInChunk(x, y)){
			this.blocks[(y << 5)|x] = b;
			var type = b.getType(), idx = this.indexChunk;
			/* Near Block Bitwise Algorithm
						*
					*	b *
						*
				"*" means bocks next to our block "b".
			*/
			for(var k = 1; k <= 7; k += 2){
				var i = (k % 3), j = (k / 3)|0;
				var xb = ((idx << 5) + x + i - 1), xc =  xb >> 5;
				var nb = xc == idx ? this : g.getChunk(xc);
				if(nb != undefined){
					nb = nb.getBlock(xb, y + j - 1);
					if(nb != undefined){
						var t1 = nb.getType();
						nb.toggleNear(1 - (t1 ^ type), 2 - i, 2 - j);
						if(t1 == type){ b.toggleNear(1, i, j); }
						g.mergeTextureBlock(nb);
					}else{ b.toggleNear(0, i, j); }
				}
				g.mergeTextureBlock(b);
			}
		}
	};

	getBlock(x, y){
		return this.isInChunk(x, y) ? this.blocks[(x << 5) | y] : this.blocks[0];
	};

	draw(game, ctx){
		var camera = game.getCamera().position;
		var hWidth = game.getWidth() >> 1, hHeight = game.getHeight() >> 1;

		var xCamera = camera.getX();
		var xChunk = this.indexChunk << 10;
		var x0 = Math.max(0, Math.floor(((xCamera - hWidth - xChunk) / 32)));
		var x1 = Math.min(32, Math.ceil(((xCamera + hWidth - xChunk) / 32)));

		var yCamera = camera.getY();
		var yChunk = (hHeight - yCamera) | 0;
		var y0 = Math.max(0, Math.floor((yCamera - hHeight) / 32));
		var y1 = Math.min(32, Math.ceil((yCamera + hHeight) / 32));

		xChunk = (xChunk + hWidth - xCamera) | 0;

		for(var j = y0; j < y1; j++){
			var jj = (j << 5);
			var yBlock = yChunk + jj;
			for(var i = x0; i < x1; i++){
				var block = this.blocks[jj | i];
				if(block.getType() > 0){
					var xBlock = xChunk + (i << 5);
					block.draw(game, ctx, xBlock, yBlock);
				}
			}
		}
	};

	generate(g, h){
		for(var i = 0; i < 32; i++){
			for(var j = 0; j < h; j++){
				this.setBlock(g, i, j, g.block_AIR);
			}
			for(var j = h; j < 32; j++){
				this.setBlock(g, i, j, new Ground());
			}
		}
		this.setGenerated(true);
	};

	preGenerate(g, l){
		for(var j = 0; j < 32; j++){
			var jj = j * 32;
			for(var i = 0; i < 32; i++){
				var block;
				switch(l[i + jj]){
					case 0: block = new Ground(); break;
					case 129: block = new Rock(); break;
					case 194: block = new Spikes(); break;
					case 225: block = new Stair(); break;
					default: block = g.block_AIR;
				}
				this.setBlock(g, i, j, block);
			}
		}
		this.setGenerated(true);
	};
}
