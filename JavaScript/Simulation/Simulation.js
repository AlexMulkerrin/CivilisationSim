function Simulation(w,h) {
	this.width = w;
	this.height = h;
	//this.depth = d;
	//this.block = [];

	//this.radius = Math.floor(this.width/2);
	this.createTerrain(this.width, this.height);
}

Simulation.prototype.setMapFromImage = function (image) {
	var index, r, g, b;
	var colourString;

	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = image.width;
	tempCanvas.height = image.height;
	var ctx = tempCanvas.getContext("2d");
	ctx.drawImage(image, 0, 0);
	var imageData = ctx.getImageData(0, 0, image.width, image.height);

	this.createTerrain(image.width, image.height);

	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			index = (i + j * image.width) * 4;
			r = imageData.data[index];
			g = imageData.data[index+1];
			b = imageData.data[index+2];
			colourString = toRGBString(r, g, b);
			for (var e=0; e<biomeStrings.length; e++) {
				if (colourString === biomeStrings[e]) {
					this.terrain[(this.width-1)-i][j].biome = e;
				}
			}
		}
	}

};

Simulation.prototype.createTerrain = function(width, height) {
	this.width = width;
	this.height = height;

	this.terrain = [];
	for (var i=0; i<this.width; i++) {
		this.terrain[i] = [];
		for (var j=0; j<this.height; j++) {
			this.terrain[i][j] = new Tile();
		}
	}
}

function Tile() {
	this.elevation = 0;
	this.biome = biomeID.ocean;
}
