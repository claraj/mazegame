// Key:
// @ = player start
// # = a box
// * = the target box

const PLAYER = "@"
const BOX = "#"
const TARGET = "*"
const EMPTY = " "

const colors = {
	[PLAYER] : "green",
	[BOX]: "black",
	[TARGET]: "red"
}

const UP = 38;
const DOWN = 40
const LEFT = 37
const RIGHT = 39

var currentLevel = 0;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

// Pixel height, width of the canvas element
var height = canvas.height;
var width = canvas.width;

// Pixel height and width of each cell in the maze grid
var cellHeight, cellWidth;

// Number of cells high, and cells wide
var levelHeight, levelWidth;

// Where is the player? This is in cells, not pixels
var playerX, playerY;

// All of the cells in the maze; including the target, not including the player
var cells;

// Listen for key events, to move player
window.addEventListener('keydown', movePlayer)

// Starts the game
loadNextLevel()

function loadNextLevel() {

	if (levels[currentLevel]) {

		// Another level in the levels array?
		// load and draw this level's cells
		cells = readLevel(levels[currentLevel]);
		drawLevel(cells)

	} else {
		// No more levels - user has completed the game

		// Stop user moving around
		window.removeEventListener('keydown', movePlayer)
		// Play winning sound; wav file by sauer2 at OpenGameArt.org
		var audio = new Audio('media/round_end.wav');
		audio.play();
		alert('You completed all the mazes!!')

	}

	// And bump current level.
	currentLevel++;

}

/* Read all the cells in one level into an array of cell objects
A cell has a x, y coordinate and a type.
The types are the same as the characters in the level plans,
so if a cell's type is '#' then it's a box. */

function readLevel(level) {

	levelHeight = level.length;
	levelWidth = level[0].length;   // todo verify there is at least one row!

	cellHeight = height / levelHeight;   // Figure out how many pixels high each cell is
	cellWidth = width / levelWidth;     // same for height

	cells = []

	// Loop over the array of Strings for this level

	// loops over the lines, represnting y-coordinates
	for (var y = 0 ; y < level.length ; y++) {
		var line = level[y];

		// loops over the characters in a line, representing x-coordinate
		for (var x = 0 ; x < line.length ; x++) {

			var cell = line[x];   // One character e.g. '#' or '*' or '@'

			// If it's a player, don't make a cell for the player- instead, set the global playerX and playerY
			// and create an empty cell under where the player is.
			if (cell == PLAYER) {
				playerX = x; playerY = y;

				var cell = {type: EMPTY, x: x, y: y}
				cells.push(cell);
			}

			else {
				var cell = {type: cell, x: x, y: y}
				cells.push(cell)
			}

		}
	}

	return cells;

}


function drawLevel() {

	//draw background
	ctx.fillStyle = 'lightblue'
	ctx.fillRect(0, 0, width, height)

	// For every cell in the array, set color and draw
	cells.forEach(function(cell) {
		var color = colors[cell.type]

		// If the cell has a color, draw it as a rectangle. Otherwise ignore
		if (color) {
			ctx.fillStyle = color
			// x and y are grid cells. Need to scale to pixels.
			ctx.fillRect(cell.x * cellWidth, cell.y * cellHeight, cellWidth, cellHeight)
		}
	})

	// And, draw player
	ctx.fillStyle = colors[PLAYER]
	ctx.fillRect(playerX * cellWidth, playerY * cellHeight, cellWidth, cellHeight)

}


function movePlayer(e) {

	var wantX = playerX;
	var wantY = playerY;

	if (e.keyCode === UP) {
		wantY = Math.max(0, playerY - 1);
	}

	if (e.keyCode === DOWN) {
		wantY = Math.min(levelHeight - 1 , playerY + 1);
	}

	if (e.keyCode === LEFT) {
		wantX = Math.max(0, playerX - 1);
	}

	if (e.keyCode === RIGHT) {
		wantX = Math.min(levelWidth -1 , playerX + 1);
	}

	// What's in the cell that the player wants to move to?

	var nextCell = getNextCell(wantX, wantY);

	// If the player is allowed to move, then update X and Y to the desired coordinates

	// If player is at the target, load the next level.
	if (nextCell.type == TARGET) {
		loadNextLevel()
	}

	else if (nextCell.type == BOX) {
		// no move!
		// todo maybe play crash sound?
	}

	else {
		// The way is clear. Update playerX and playerY to the new desired coordinates
		playerX = wantX;
		playerY = wantY;
		// and redraw level
		drawLevel(cells)
	}

}


function getNextCell(x, y) {

	// Find the cell that's at X, Y
	nextCells = cells.filter(function(cell) {
		return (cell.x == x && cell.y == y)
	})

	// Expect one cell.
	return (nextCells[0]) ;
}
