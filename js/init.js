$(document).ready(function(){
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						function( callback ){
							window.setTimeout(callback, 1000 / 60);
						};
	})();

	var obesityGame = new Game();
	obesityGame.init("#obesity", 650, 450);
	$(document).keydown(function(e){
		var kCode = e.keyCode || e.which;+
		obesityGame.setKey(kCode, true);
	}).keyup(function(e){
		var kCode = e.keyCode || e.which;
		obesityGame.setKey(kCode, false);
	});
	$(document).click(function(e){
		var camera = obesityGame.getCamera().position;
		var canvas = $("#obesity").offset();
		var xCamera = camera.getX() - (obesityGame.getWidth() >> 1) + e.pageX - canvas.left;
		var yCamera = camera.getY() - (obesityGame.getHeight() >> 1) + e.pageY - canvas.top;
		var xBlock = xCamera >> 5;
		var yBlock = yCamera >> 5;
		var cBlock = obesityGame.getBlockInChunk(xBlock, yBlock);
		var block;
		if(cBlock instanceof Air){ block = new Ground(); }
		else{ block = obesityGame.block_AIR; }
		obesityGame.setBlockInChunk(xBlock, yBlock, block);
	}).bind('contextmenu', function(e) {
		 e.preventDefault();
		var camera = obesityGame.getCamera().position;
		var canvas = $("#obesity").offset();
		var xCamera = camera.getX() - (obesityGame.getWidth() >> 1) + e.pageX - canvas.left;
		var yCamera = camera.getY() - (obesityGame.getHeight() >> 1) + e.pageY - canvas.top;
		var xBlock = xCamera >> 5, yBlock = yCamera >> 5;
		var cBlock = obesityGame.getBlockInChunk(xBlock, yBlock);
	});
	$(window).resize(function(){
		var w = $(window);
		obesityGame.setSizes(w.width(), w.height());
	});
});
