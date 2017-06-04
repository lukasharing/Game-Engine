class Chunk{
	constructor(i){
		this.indexChunk = i;
		this.generated = false;
		this.blocks = [];
	};


	setGenerated(b)	{ this.generated = b; };
	isGenerated()	{ return this.generated; };

	isInChunk(a, b){ return (a >= 0 && a < 32) && (b >= 0 && b < 32); }
	setBlock(g, x, y, b){
		if(this.isInChunk(x, y)){
			this.blocks[(y << 5)|x] = b;
			let type = b.getType();
			/* Near Block Bitwise Algorithm
					  *
					* b *
					  *
			   "*" means bocks next to our block "b".
			   OPTIMIZE: Don't use for each neighbour the toggleNear function,
			   save in a variable and later change it.
			*/
			for(let k = 1; k <= 7; k += 2){
				let i = (k % 3), j = (k / 3)|0;
				let xb = ((this.indexChunk << 5) + (x + i - 1));
				let xc = xb >> 5;
				let nb = (xc == this.indexChunk) ? this : g.getChunk(xc);
				if(nb != undefined){
					nb = nb.getBlock(xb%32, y + j - 1);
					if(nb != null){
						let t1 = nb.getType();
						nb.toggleNear(1 - (t1 ^ type), 2 - i, 2 - j);
						if(t1 == type){ b.toggleNear(1, i, j); }
						g.mergeTextureBlock(nb);
					}else{
						b.toggleNear(0, i, j);
					}
				}
				g.mergeTextureBlock(b);
			}
		}
	};

	getBlock(x, y){
		return this.isInChunk(x, y) ? this.blocks[(y << 5) | x] : null;
	};

	draw(game, ctx){
		let camera = game.getCamera().getPosition();
		let hWidth = game.getWidth() >> 1, hHeight = game.getHeight() >> 1;

		/* X Camera Coord Aritmetics */
		let xCamera = camera.getX();
		let xChunk = this.indexChunk << 10;
		let x0 = Math.max( 0, Math.floor((xCamera - hWidth - xChunk) / 32));
		let x1 = Math.min(32, Math.ceil((xCamera + hWidth - xChunk) / 32));

		/* Y Camera Coord Aritmetics */
		let yCamera = camera.getY();
		let yChunk = (hHeight - yCamera) | 0;
		let y0 = Math.max( 0, Math.floor((yCamera - hHeight) / 32));
		let y1 = Math.min(32, Math.ceil((yCamera + hHeight) / 32));

		xChunk = (xChunk + hWidth - xCamera) | 0;

		for(let j = y0; j < y1; j++){
			let jj = (j << 5);
			let yBlock = yChunk + jj;
			for(let i = x0; i < x1; i++){
				let block = this.blocks[jj | i];
				if(block.getType() > 0){
					let xBlock = xChunk + (i << 5);
					block.draw(game, ctx, xBlock, yBlock);
				}
			}
		}
	};

	generate(g, h){
		for(let i = 0; i < 32; i++){
			for(let j = 0; j < h; j++){
				this.setBlock(g, i, j, g.block_AIR);
			}
			for(let j = h; j < 32; j++){
				this.setBlock(g, i, j, new Ground());
			}
		}
		this.setGenerated(true);
	};

	preGenerate(g, l){
		for(let j = 0; j < 32; j++){
			let jj = j * 32;
			for(let i = 0; i < 32; i++){
				let block = undefined;
				switch(l[i + jj]){
					case 0x00: block = new Ground(); break;
					case 0x81: block = new Rock(); break;
					case 0xC2: block = new Spikes(); break;
					case 0xE1: block = new Stair(); break;
					default: block = g.block_AIR;
				}
				this.setBlock(g, i, j, block);
			}
		}
		this.setGenerated(true);
	};
}
