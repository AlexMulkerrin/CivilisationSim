function Terrain (width, height) {
	this.width = width;
	this.height = height;
	this.seed = 0;

	this.tile = [];
	this.initialiseBlankTiles();

	this.island = [];
}

Terrain.prototype.initialiseBlankTiles = function () {
	for (var i = 0; i<this.width; i++) {
		this.tile[i] = [];
		for ( var j=0; j<this.height; j++) {
			this.tile[i][j] = new Tile();
		}
	}
};

Terrain.prototype.setFromImage = function (image) {
	var index, r, g, b;
	var colourString;

	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = image.width;
	tempCanvas.height = image.height;
	var ctx = tempCanvas.getContext("2d");
	ctx.drawImage(image, 0, 0);
	var imageData = ctx.getImageData(0, 0, image.width, image.height);

	this.width = image.width;
	this.height = image.height;
	this.initialiseBlankTiles();

	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			index = (i + j * image.width) * 4;
			r = imageData.data[index];
			g = imageData.data[index+1];
			b = imageData.data[index+2];
			colourString = toRGBString(r, g, b);
			for (var e=0; e<biomeStrings.length; e++) {
				if (colourString === biomeStrings[e]) {
					this.tile[i][j].biome = e;
				}
			}
		}
	}
	this.findCoast();
	this.setElevation();
};

Terrain.prototype.findCoast = function() {
	var adj = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			if (this.tile[i][j].biome == biomeID.ocean) {
				for (var e=0; e<adj.length; e++) {
					var x = (i + adj[e][0]) % (this.width);
					if (x<0) x+=this.width;
					var y = (j +adj[e][1]) % (this.height);
					if (y<0) y+=this.height;

					if (this.tile[x][y].biome == biomeID.ocean || this.tile[x][y].biome == biomeID.coast ) {

					} else {
						this.tile[i][j].biome = biomeID.coast;
					}
				}
			}
		}
	}
}

Terrain.prototype.setElevation = function () {
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			switch (this.tile[i][j].biome) {
				case biomeID.ocean:
					this.tile[i][j].elevation = -2;
					break;
				case biomeID.coast:
					this.tile[i][j].elevation = -1;
					break;
				case biomeID.forest:
				case biomeID.jungle:
				case biomeID.swamp:
				case biomeID.hill:
					this.tile[i][j].elevation = 1;
					break;
				case biomeID.mountain:
					this.tile[i][j].elevation = 2;
					break;
			}
		}
	}
};

Terrain.prototype.getCornerAverage = function(x,y) {
	var result = 0;
	var adj = [[0,0],[-1,0],[0,-1],[-1,-1]];
	for (var e=0; e<adj.length; e++) {
		var nx = x + adj[e][0];
		var ny = y + adj[e][1];
		if (nx<0) nx = this.width-1;
		if (ny<0) ny = this.height-1;
		result += this.tile[nx][ny].elevation;
	}
	return result/adj.length;
}

Terrain.prototype.getCoastElevation = function(x,y) {
	var adj = [[0,0],[-1,0],[0,-1],[-1,-1]];
	for (var e=0; e<adj.length; e++) {
		var nx = x + adj[e][0];
		var ny = y + adj[e][1];
		if (nx<0) nx = this.width-1;
		if (ny<0) ny = this.height-1;
		if (this.tile[nx][ny].biome !== biomeID.coast) {
			if (this.tile[nx][ny].biome == biomeID.ocean) {
				return this.tile[nx][ny].elevation;
			}
			return 0;
		}
	}
	return this.tile[x][y].elevation
}

// Tile Class
function Tile() {
	this.elevation = 0;
	this.biome = biomeID.rock;
}
