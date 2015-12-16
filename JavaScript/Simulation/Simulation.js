function Simulation(w,h) {
	this.width = w;
	this.height = h;
	//this.depth = d;
	//this.block = [];

	//this.radius = Math.floor(this.width/2);
	this.terrain = new TerrainGenerator(this.width, this.height);
}
