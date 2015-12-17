
function loadProgram() {
	var program = new Program("CivCanvas");


}

function Program(canvasName) {
	this.refreshDelay = 50;
	this.canvasName = canvasName;

	this.simulation = new Simulation(10,10);

	this.loadMapImage("EarthMapLarge");

}

Program.prototype.update = function() {
	this.display.update();
	this.control.mouse.isReleased = false;
}

Program.prototype.loadMapImage = function (imageName) {
	var image = new Image();
	image.src = "Resources/EarthMapLarge.png";
	var t = this;
	image.onload = function() {
		t.simulation.setMapFromImage(image);

		t.display = new Display(t.canvasName, t.simulation);
		t.control = new Control(t.canvasName, t.simulation, t.display);
		t.display.linkControl(t.control);

		t.display.update();
		setInterval(function(){t.update();}, t.refreshDelay);
	}

};
