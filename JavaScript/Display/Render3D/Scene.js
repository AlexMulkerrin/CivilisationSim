function Scene(simulation) {
	this.targetSim = simulation;

	this.model = [];
}

Scene.prototype.createModels = function() {
	this.model[0] = new Model([0,0,0],[0,0,0]);
	this.createElevationSphere(this.targetSim.terrain.width,this.targetSim.terrain.height,20);
	this.model[1] = new Model([25,0,0],[0,0,0]);
	this.model[1].orbitVector = [0,0,0.01];
	this.model[1].addCube([0,0,0],[1,0,0],1);


	this.createHomes();
//	this.createTrees();
	this.createStars();

	this.createOceanSphere();

}

Scene.prototype.createElevationSphere = function(longitudeBands, latitudeBands, radius) {
	var vertexPositons = [];
	var vertexElevations = [];
	var map = this.targetSim.terrain.tile;

	for (var latNum=0; latNum <= latitudeBands; latNum++) {
		var theta = latNum * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNum=0; longNum <= longitudeBands; longNum++) {
			var phi = longNum * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = sinPhi * sinTheta;
			var y = cosTheta;
			var z = cosPhi * sinTheta;

			var e = 0;
			var tile = map[longNum%longitudeBands][latNum%latitudeBands];
			if (tile.biome == biomeID.coast) {
				var e = this.targetSim.terrain.getCoastElevation(longNum%longitudeBands,latNum%latitudeBands);
			} else if (tile.biome == biomeID.ocean) {
				var e = tile.elevation;
			}
			var r = radius*(1+e/50);
			vertexPositons.push([x*r, y*r, z*r]);
			vertexElevations.push(e);
		}
	}

	for (var latNum=0; latNum < latitudeBands; latNum++) {
		for (var longNum=0; longNum < longitudeBands; longNum++) {
			var a = latNum * (longitudeBands+1) + longNum;
			var b = a + longitudeBands +1;

			var pos = [];
			pos[0] = vertexPositons[a];
			pos[1] = vertexPositons[b];
			pos[2] = vertexPositons[a+1];
			pos[3] = vertexPositons[b+1];

			var biome = this.targetSim.terrain.tile[longNum][latNum].biome;
			var colour = biomePalette[biome];

			if (this.targetSim.terrain.tile[longNum][latNum].elevation>0) {
				var midX = (vertexPositons[a][0] + vertexPositons[b+1][0])/2;
				var midY = (vertexPositons[a][1] + vertexPositons[b+1][1])/2;
				var midZ = (vertexPositons[a][2] + vertexPositons[b+1][2])/2;

				var e = this.targetSim.terrain.tile[longNum][latNum].elevation;
				var r = 1 + e/50;
				pos[4] = [midX*r, midY*r, midZ*r];

				this.model[0].addPyramid(pos, colour);
			} else {
				if (vertexElevations[a] == vertexElevations[b+1]) {
					this.model[0].addQuad(pos, colour, false);
				} else {
					this.model[0].addQuad(pos, colour, true);
				}
			}
		}
	}
}

Scene.prototype.createOceanSphere = function() {
	var indexOffset = this.model.length;
	this.model[indexOffset] = new Model([0,0,0],[0,0,0]);
	this.model[indexOffset].addSphere(this.targetSim.terrain.width,this.targetSim.terrain.height,19.95);
}

Scene.prototype.createStars = function() {
	var pos = [];
	var norm = [];
	var colour = [];
	var indexOffset = this.model.length;
	var disp = [[0,0],[0.003,0.005],[-0.003,0.005]];
	for (var i=0; i<1000; i++) {
		var theta = Math.random()*Math.PI;
		var phi = Math.random()*2*Math.PI;
		var r = Math.random()*50+500;

		for (var j=0; j<disp.length; j++) {

			var x = Math.cos(phi+disp[j][0]) * Math.sin(theta+disp[j][1]);
			var y = Math.cos(theta+disp[j][1]);
			var z = Math.sin(phi+disp[j][0]) * Math.sin(theta+disp[j][1]);


			pos[j] = [x*r, y*r, z*r];
			norm[j]= [-x,-y,-z];
			colour[j] = [1,1,1];
		}
		this.model[indexOffset] = new Model([0,0,0],[0,0,0]);
		this.model[indexOffset].addTriangle(pos, norm, colour);
		indexOffset++;
	}
}

Scene.prototype.createTrees = function() {
	var pos = [];
	var norm = [];
	var colour = [];
	var indexOffset = this.model.length;
	for (var i=0; i<2000; i++) {
		var longNum = Math.floor(Math.random() * this.targetSim.width);
		var latNum = Math.floor(Math.random() * this.targetSim.height);
		if (this.targetSim.terrain.tile[longNum][latNum].biome == biomeID.hill) {

			var theta = latNum*Math.PI / this.targetSim.height;
			var phi = longNum*2*Math.PI / this.targetSim.width;

			var e = this.targetSim.terrain.tile[longNum][latNum].elevation;
			var r = 20*(e*0.1+0.95);

			var x = Math.cos(phi) * Math.sin(theta);
			var y = Math.cos(theta);
			var z = Math.sin(phi) * Math.sin(theta);


			pos = [x*r, y*r, z*r];
			colour = [0,Math.random()/2+0.5,0];

			this.model[indexOffset] = new Model(pos,[0,0,0]);
			this.model[indexOffset].addCube([0,0,0], colour, 0.2);
			indexOffset++;
		}
	}
}

Scene.prototype.createHomes = function() {
	var pos = [];
	var norm = [];
	var colour = [];
	var indexOffset = this.model.length;
	for (var i=0; i<100; i++) {
		var longNum = Math.floor(Math.random() * this.targetSim.terrain.width);
		var latNum = Math.floor(Math.random() * this.targetSim.terrain.height);
		//if (this.targetSim.terrain.tile[longNum][latNum].biome !== biomeID.ocean) {

			var theta = (latNum+0.5)*Math.PI / this.targetSim.terrain.height;
			var phi = (longNum+0.5)*2*Math.PI / this.targetSim.terrain.width;

			var e = this.targetSim.terrain.tile[longNum][latNum].elevation;
			var r = 20*(1+e/50);

			var x = Math.sin(phi) * Math.sin(theta);
			var y = Math.cos(theta);
			var z = Math.cos(phi) * Math.sin(theta);


			pos = [x*r, y*r, z*r];
			colour = [1,0,0];

			var rotX = Math.cos(phi);
			var rotZ = -Math.sin(phi);

			this.model[indexOffset] = new Model(pos,[0,0,0]);
			this.model[indexOffset].addCube([0,0,0], colour,0.2);
			indexOffset++;
		//}
	}
}
