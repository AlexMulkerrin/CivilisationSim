const biomeID = { 		rock:0, ocean:1, coast:2, beach:3, grass:4,
						hill:5, mountain:6, plain:7, desert:8, tundra:9,
						ice:10, river:11, forest:12, jungle:13, swamp:14};

const biomeStrings = [	"#7f7f7f","#4d6df3","#59c9ff", "#ffffd1", "#00ca00",
						"#787878", "#dcdcdc", "#fff200", "#fff9bd", "#9c5a3c",
						"#ffffff", "#99d9ea", "#008000", "#6f3198", "#00d96c"
					];

var biomePalette = [];

function Display(canvasName, simulation) {
	this.targetSim = simulation;

	this.canvas = document.getElementById(canvasName);
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx = this.canvas.getContext("2d");

	this.createPalette();

	this.render3D = new Render3D(this.targetSim);

	this.createBackground();
	this.createForeground();
}

Display.prototype.linkControl = function(control) {
	this.targetControl = control
}

Display.prototype.createPalette = function() {
	biomePalette = [];
	for (var i=0; i<biomeStrings.length; i++) {
		biomePalette[i] = colourComponents(biomeStrings[i]);
	}
}

Display.prototype.createBackground = function() {
	this.background = document.createElement('canvas');
	this.background.width = window.innerWidth;
	this.background.height = window.innerHeight;
	this.background.ctx = this.background.getContext("2d");

	this.background.size = 275;
	this.updateBackground();

}

Display.prototype.createForeground = function() {
	this.foreground = document.createElement('canvas');
	this.foreground.width = window.innerWidth;
	this.foreground.height = window.innerHeight;
	this.foreground.ctx = this.foreground.getContext("2d");

	this.updateForeground();

}

Display.prototype.update = function() {
	this.clearCanvas();
	this.render3D.update();
	this.ctx.drawImage(this.render3D.canvas,0,0);
	//this.drawInterface();
	//this.drawMap();
	this.drawForeground();
}

Display.prototype.drawForeground = function() {
	this.ctx.drawImage(this.foreground,0,0);
}

Display.prototype.clearCanvas = function() {
	//this.ctx.fillStyle = this.gradient;
	//if (this.background.size < 200 + this.render3D.camera.modelMatrix[14]) {
		//this.updateBackground();
	//}
	this.ctx.drawImage(this.background,0,0);

}

Display.prototype.updateBackground = function() {
	//this.background.size = (500 + this.render3D.camera.viewMatrix[14]);
	size = this.background.size;
	var midX = this.background.width/2;
	var midY = this.background.height/2;
	this.background.gradient = this.background.ctx.createRadialGradient(midX,midY,size,midX,midY,size+50);
	//this.background.gradient.addColorStop(0, "#35CCFF");
	this.background.gradient.addColorStop(1, "black");

	this.background.ctx.fillStyle = "#000000";
	this.background.ctx.fillRect(0, 0, this.background.width, this.background.height);
	this.background.ctx.fillStyle = this.background.gradient;
	this.background.ctx.fillRect(0, 0, this.background.width, this.background.height);
}

Display.prototype.drawInterface = function() {
	this.ctx.fillStyle = "#ffffff";
	this.ctx.fillText("total verticies: "+this.render3D.scene.totalVerticies, 5,12);
	this.ctx.fillText("mouse: "+this.targetControl.mouse.x+","+this.targetControl.mouse.y, 5,24);

	var ang = this.render3D.camera.getCoordBelow();
	var y = ang[0] *this.targetSim.height / Math.PI;
	var x = ang[1] *this.targetSim.width / (Math.PI*2);

	this.ctx.fillText("camera: "+x+","+y, 5,36);

}

Display.prototype.updateForeground = function() {
	this.drawMap();
}

Display.prototype.drawMap = function() {
	var sqSize=1;
	var map = this.targetSim.terrain;
	this.foreground.ctx.fillStyle = "#ffffff";
	this.foreground.ctx.fillRect(0, 0, map.width*sqSize+2, map.height*sqSize+2);
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			this.foreground.ctx.fillStyle = biomeStrings[map.tile[i][j].biome];
			this.foreground.ctx.fillRect(i*sqSize+1, j*sqSize+1, sqSize, sqSize);
		}
	}
}


function colourComponents(colour) {
	var components=[], string;
	for (var i=0; i<3; i++) {
		// "#rrggbb"
		string = colour[1+i*2]+colour[2+i*2];
		components[i]=parseInt(string,16)/255;
	}
	return components;
}

function toRGBString(red, green, blue) {
    var colourString = '#';
    if (red < 16) colourString += '0';
    colourString += red.toString(16);
    if (green < 16) colourString += '0';
    colourString += green.toString(16);
    if (blue < 16) colourString += '0';
    colourString += blue.toString(16);
    return colourString;
}
