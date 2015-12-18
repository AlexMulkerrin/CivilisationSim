const unitType = {settler:0};

function Simulation(width,height) {
	this.terrain = new Terrain(width, height);
	this.unit = [];
	this.faction = [];

	this.turn = 0;
	this.framesPerTurn = 3;
	this.framesTillUpdate = this.framesPerTurn ;
}

Simulation.prototype.createSettlers = function (number) {
	for (var i=0; i<number; i++) {
		var pos = this.terrain.getLandTile();
		this.unit[i] = new Agent(pos[0], pos[1], unitType.settler);
	}
}

function Agent(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
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

Simulation.prototype.update = function() {
	if (this.framesTillUpdate<1) {
		for (var i=0; i<this.unit.length; i++) {
			var dx = random(3)-1;
			var dy = random(3)-1;
			var nx = (this.unit[i].x+dx)%this.terrain.width;
			var ny = (this.unit[i].y+dy)%this.terrain.height;
			if (nx<0) nx += this.terrain.width-1;
			if (ny<0) ny += this.terrain.height-1;
			if (this.terrain.tile[nx][ny].biome !== biomeID.ocean && this.terrain.tile[nx][ny].biome !== biomeID.coast) {
				this.unit[i].x = nx;
				this.unit[i].y = ny;
			}
		}
		this.turn++;
		this.framesTillUpdate = this.framesPerTurn
	} else {
		this.framesTillUpdate--;
	}
}

function random(num) {
	return Math.floor(Math.random()*num);
}
