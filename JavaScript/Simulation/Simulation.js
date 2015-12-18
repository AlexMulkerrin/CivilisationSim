function Simulation(width,height) {
	this.terrain = new Terrain(width, height);
	this.unit = [];
	this.faction = [];

	this.turn = 0;
}



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
