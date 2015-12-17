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
					this.terrain[i][j].biome = e;
				}
			}
		}
	}
	this.findCoast();

};

Simulation.prototype.setElevationFromImage = function (image) {
	var index, e;

	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = image.width;
	tempCanvas.height = image.height;
	var ctx = tempCanvas.getContext("2d");
	ctx.drawImage(image, 0, 0);
	var imageData = ctx.getImageData(0, 0, image.width, image.height);

	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			index = (i + j * image.width) * 4;
			e = imageData.data[index];
			this.terrain[i][j].elevation = e/200;
			if (e>100) {
				this.terrain[i][j].biome = biomeID.mountain;
			} else if (e>60) {
				this.terrain[i][j].biome = biomeID.hill;
			}
			if (this.terrain[i][j].biome == biomeID.ocean) {
				this.terrain[i][j].elevation = -0.1;
			}

		}
	}

};

Simulation.prototype.findCoast = function() {
	var adj = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			if (this.terrain[i][j].biome == biomeID.ocean) {
				for (var e=0; e<adj.length; e++) {
					var x = (i + adj[e][0]) % (this.width-1);
					if (x<0) x+=this.width;
					var y = (j +adj[e][1]) % (this.height-1);
					if (y<0) y+=this.height;

					if (this.terrain[x][y].biome == biomeID.ocean || this.terrain[x][y].biome == biomeID.coast ) {

					} else {
						this.terrain[i][j].biome = biomeID.coast;
					}
				}
			}
		}
	}
}


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
