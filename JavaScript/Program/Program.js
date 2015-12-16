
function loadProgram() {
	var program = new Program("CivCanvas");

	program.display.update();
	setInterval(function(){program.update();}, program.refreshDelay);
}

function Program(canvasName) {
	this.refreshDelay = 50;

	this.simulation = new Simulation(360,180);
	this.display = new Display(canvasName, this.simulation);
	this.control = new Control(canvasName, this.simulation, this.display);
	this.display.linkControl(this.control);

}

Program.prototype.update = function() {
	this.display.update();
	this.control.mouse.isReleased = false;
}
