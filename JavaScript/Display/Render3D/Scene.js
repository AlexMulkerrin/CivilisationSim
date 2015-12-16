function Scene(simulation) {
	this.targetSim = simulation;

	//this.totalVerticies = 0;
	//this.vertexArray = [];
	this.model = [];
}

Scene.prototype.createModels = function() {
	this.model[0] = new Model([0,0,0],[0,0,0]);
	this.createElevationSphere(this.targetSim.width,this.targetSim.height,20);
	this.model[1] = new Model([25,0,0],[0,0,0]);
	this.model[1].orbitVector = [0,0,0.01];
	this.model[1].addCube([0,0,0],[1,0,0],1);
	this.createHomes();
	this.createTrees();
	this.createStars();
}

Scene.prototype.createElevationSphere = function(longitudeBands, latitudeBands, radius) {
	var vertexPositons = [];
	var vertexNormals = [];
	var vertexElevations = [];
	var vertexOcclusion = [];

	for (var latNum=0; latNum <= latitudeBands; latNum++) {
		var theta = latNum * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNum=0; longNum <= longitudeBands; longNum++) {
			var phi = longNum * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;

			var e = this.targetSim.terrain.elevation[longNum%longitudeBands][latNum%latitudeBands];
			var r = radius*(e*0.1+0.95);


			vertexNormals.push([x,y,z]);
			vertexPositons.push([x*r, y*r, z*r]);
			vertexElevations.push(e);
			vertexOcclusion.push(this.targetSim.terrain.getOcclusion(longNum%longitudeBands, latNum%latitudeBands));

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

			var norm = [];
			norm[0] = vertexNormals[a];
			norm[1] = vertexNormals[b];
			norm[2] = vertexNormals[a+1];
			norm[3] = vertexNormals[b+1];

			//var colour = [0,Math.random(),0.5];
			var biome = this.targetSim.terrain.biome[longNum][latNum];
			//var avElevation = vertexElevations[a]+vertexElevations[b]+vertexElevations[a+1]+vertexElevations[b+1]/4;
			var biomeColour = biomePalette[biome];

			var colour = [];
			colour[0] = scalarMultiplyVector3(1/vertexOcclusion[a], biomeColour);//[0,avElevation,0.5];
			colour[1] = scalarMultiplyVector3(1/vertexOcclusion[b], biomeColour);
			colour[2] = scalarMultiplyVector3(1/vertexOcclusion[a+1], biomeColour);
			colour[3] = scalarMultiplyVector3(1/vertexOcclusion[b+1], biomeColour);

			this.model[0].addQuad(pos, norm, colour);
		}
	}
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
		if (this.targetSim.terrain.biome[longNum][latNum] == biomeID.hill) {

			var theta = latNum*Math.PI / this.targetSim.height;
			var phi = longNum*2*Math.PI / this.targetSim.width;

			var e = this.targetSim.terrain.elevation[longNum][latNum];
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
		var longNum = Math.floor(Math.random() * this.targetSim.width);
		var latNum = Math.floor(Math.random() * this.targetSim.height);
		if (this.targetSim.terrain.biome[longNum][latNum] == biomeID.grass) {

			var theta = latNum*Math.PI / this.targetSim.height;
			var phi = longNum*2*Math.PI / this.targetSim.width;

			var e = this.targetSim.terrain.elevation[longNum][latNum];
			var r = 20*(e*0.1+0.95);

			var x = Math.cos(phi) * Math.sin(theta);
			var y = Math.cos(theta);
			var z = Math.sin(phi) * Math.sin(theta);


			pos = [x*r, y*r, z*r];
			colour = [1,0,0];

			this.model[indexOffset] = new Model(pos,[0,0,0]);
			this.model[indexOffset].addCube([0,0,0], colour,0.2);
			indexOffset++;
		}
	}
}

// 3D Model Class, to be moved to separate file
function Model(positionVector, rotationVector) {
	this.totalVerticies = 0;
	this.vertexArray = [];
	this.modelMatrix = identityMatrix4();
	this.x = positionVector[0];
	this.y = positionVector[1];
	this.z = positionVector[2];

	this.orbitVector = [0,0,0];
	this.rotationVector = rotationVector;

	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, this.rotationVector[0], [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, this.rotationVector[1], [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, this.rotationVector[2], [0,0,1]);

	this.modelMatrix = multiplyMatrix4(rotationMatrix, this.modelMatrix, this.modelMatrix);
	this.modelMatrix = translateMatrix4(this.modelMatrix, this.x, this.y, this.z);

	this.normalMatrix = emptyMatrix3();
	this.normalMatrix = mat4toInverseMat3(this.modelMatrix, this.normalMatrix);
	this.normalMatrix = mat3transpose(this.normalMatrix);
}

Model.prototype.update = function() {
	//this.updateRotation();
	//this.updateOrbit();
}

Model.prototype.updateRotation = function() {
	this.modelMatrix = translateMatrix4(this.modelMatrix, -this.x, -this.y, -this.z);
	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.rotationVector[0]), [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.rotationVector[1]), [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.rotationVector[2]), [0,0,1]);
	this.modelMatrix = multiplyMatrix4(rotationMatrix, this.modelMatrix, this.modelMatrix);

	this.modelMatrix = translateMatrix4(this.modelMatrix, this.x, this.y, this.z);
}

Model.prototype.updateOrbit = function() {
	var rotationMatrix = identityMatrix4();
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.orbitVector[0]), [1,0,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.orbitVector[1]), [0,1,0]);
	rotationMatrix = rotateMatrix4(rotationMatrix, degToRad(this.orbitVector[2]), [0,0,1]);
	this.modelMatrix = multiplyMatrix4(rotationMatrix, this.modelMatrix, this.modelMatrix);
	this.x = this.modelMatrix[12];
	this.y = this.modelMatrix[13];
	this.z = this.modelMatrix[14];
}

Model.prototype.addCube = function(position, colour, scale) {
	var shape = new CubeMesh();
	var x,y,z;
	for (var i=0; i<shape.vertex.length; i++) {
		x = shape.vertex[i][0]*scale + position[0];
		y = shape.vertex[i][1]*scale + position[1];
		z = shape.vertex[i][2]*scale + position[2];
		this.vertexArray.push(x,y,z);
		this.vertexArray.push(colour[0],colour[1],colour[2]);
		this.vertexArray.push(shape.normal[i][0],shape.normal[i][1],shape.normal[i][2]);
		this.totalVerticies++;
	}
}

Model.prototype.addQuad = function(pos, norm, colour) {
	this.addTriangle(
		[pos[0], pos[1], pos[2]],
		[norm[0], norm[1], norm[2]],
		[colour[0], colour[1], colour[2]]
	);
	this.addTriangle(
		[pos[1], pos[3], pos[2]],
		[norm[1], norm[3], norm[2]],
		[colour[1], colour[3], colour[2]]
	);
}

Model.prototype.addTriangle = function(pos, norm, colour) {
	//newNorm = CalculateNormal(pos[0], pos[1], pos[2]);

	for (var i=0; i<pos.length; i++) {
		this.vertexArray.push(pos[i][0],pos[i][1],pos[i][2]);
		this.vertexArray.push(colour[i][0],colour[i][1],colour[i][2]);
		this.vertexArray.push(norm[i][0],norm[i][1],norm[i][2]);

		this.totalVerticies++;
	}

}

function CalculateNormal(v1,v2,v3) {
	var e31=[v3[0]-v1[0],v3[1]-v1[1],v3[2]-v1[2]];
	var e32=[v3[0]-v2[0],v3[1]-v2[1],v3[2]-v2[2]];
	var cross = [e31[1]*e32[2]-e31[2]*e32[1],
				-1*(e31[0]*e32[2]-e31[2]*e32[0]),
				e31[0]*e32[1]-e31[1]*e32[0]];
	var mag = Math.sqrt(cross[0]*cross[0]+cross[1]*cross[1]+cross[2]*cross[2]);
	cross[0]/=mag;
	cross[1]/=mag;
	cross[2]/=mag;

	cross[0] *= -1;
	cross[1] *= -1;
	cross[2] *= -1;
	return cross;
}

function CubeMesh() {
	// corner verticies
	var c=[	[1,-1,1], [-1,1,1],		[1,1,1],	[-1,-1,1],
			[1,1,-1], [-1,1,-1],	[1,-1,-1],	[-1,-1,-1]];
	this.vertex =	[	c[0],	c[1],	c[2],
						c[3],	c[1],	c[0],
						c[4],	c[5],	c[6],
						c[7],	c[6],	c[5],

						c[2],	c[4],	c[0],
						c[4],	c[6],	c[0],
						c[5],	c[1],	c[7],
						c[3],	c[7],	c[1],

						c[4],	c[2],	c[1],
						c[5],	c[4],	c[1],
						c[7],	c[0],	c[6],
						c[0],	c[7],	c[3]];
	// array of face normals
	var d = [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]];
	this.normal=[ d[0], d[0], d[0],
				d[0], d[0], d[0],
				d[1], d[1], d[1],
				d[1], d[1], d[1],

				d[2], d[2], d[2],
				d[2], d[2], d[2],
				d[3], d[3], d[3],
				d[3], d[3], d[3],

				d[4], d[4], d[4],
				d[4], d[4], d[4],
				d[5], d[5], d[5],
				d[5], d[5], d[5]];
}
