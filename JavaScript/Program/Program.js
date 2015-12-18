
function loadProgram() {
	var program = new Program("CivCanvas");


}

function Program(canvasName) {
	this.refreshDelay = 50;
	this.canvasName = canvasName;

	this.simulation = new Simulation(10,10);

	this.toLoad = 0;
	this.loaded = 0;
	this.image = [];
	this.loadMapImage("EarthMapSmall");
	//this.loadMapImage("heightmap");

}

Program.prototype.update = function() {
	this.display.update();
	this.control.mouse.isReleased = false;
}

Program.prototype.loadMapImage = function (imageName) {

 	this.image[this.toLoad] = new Image();
	this.image[this.toLoad].src = "Resources/"+imageName+".png";
	var t = this;
	this.image[this.toLoad].onload = function() {
		t.loaded++;
		if (t.loaded == t.toLoad) {
			t.onMapLoaded();
		}
	}
	this.toLoad++;
};

Program.prototype.onMapLoaded = function() {
	this.simulation.terrain.setFromImage(this.image[0]);
	//this.simulation.setElevationFromImage(this.image[1]);

	this.display = new Display(this.canvasName, this.simulation);
	this.control = new Control(this.canvasName, this.simulation, this.display);
	this.display.linkControl(this.control);

	this.display.update();
	var t = this;
	setInterval(function(){t.update();}, t.refreshDelay);
}
