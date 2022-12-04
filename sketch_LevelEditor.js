const TILE_WIDTH = 80;
const TILE_HEIGHT = 40;
const TILES_ACROSS = 12;
const TILES_VERTICAL = 15;
const BOARD_WIDTH_PIXLES = TILE_WIDTH * TILES_ACROSS;
const BOARD_HEIGHT_PIXLES = TILE_HEIGHT * TILES_VERTICAL;
const BALL_DIAMETER = 10;
const BALL_RADIUS = BALL_DIAMETER / 2;
const STARTING_VEL = 10;
const MIN_VEL = 4;
const MAX_VEL = 12;
const KILL_BARRIER_Y = BOARD_HEIGHT_PIXLES - 10;
const BAR_WIDTH = 20;


const tilTiles = [];

var tilSelectedTile;

function setup()
{
	angleMode(DEGREES);
	createCanvas(windowWidth - 17, windowHeight);
	frameRate(50);
	
	for(var intI = 0; intI < TILES_ACROSS; intI++)
	{
		tilTiles[intI] = Array(TILES_VERTICAL + 1).fill(null);
	}
	
	tilSelectedTile = null;
	
	tilTiles[1][TILES_VERTICAL] = new normalTile();
	tilTiles[2][TILES_VERTICAL] = new bombTile();
	tilTiles[3][TILES_VERTICAL] = new timeTile();
	tilTiles[4][TILES_VERTICAL] = new unbreakableTile();
	tilTiles[5][TILES_VERTICAL] = new keyTile();
	tilTiles[6][TILES_VERTICAL] = new lockedTile();
	tilTiles[7][TILES_VERTICAL] = new portalTile();
	tilTiles[8][TILES_VERTICAL] = new ballTile();
}

function mouseClicked()
{
	intRightSideOfButton = ((windowWidth / 2) - (TILE_WIDTH * (TILES_ACROSS / 2))) - 5
	
	if(mouseX < intRightSideOfButton && mouseX > intRightSideOfButton - 40 && mouseY > 10 && mouseY < 50)
	{
		levelToClipboard();
	}
}

function draw()
{
	background(255);
	
	translate((windowWidth / 2) - (TILE_WIDTH * (TILES_ACROSS / 2)), 10);//Translate to put board in correct place
	
	noFill();
	stroke(0);
	rect(-2, -2, TILE_WIDTH * TILES_ACROSS + 2, TILE_HEIGHT * TILES_VERTICAL + 2);//Place board
	
	for(var intI = 1; intI <= TILES_ACROSS; intI++)
		line(intI * TILE_WIDTH, -2, intI * TILE_WIDTH, TILE_HEIGHT * TILES_VERTICAL);
	
	for(var intI = 1; intI <= TILES_VERTICAL; intI++)
		line(-2, intI * TILE_HEIGHT, TILE_WIDTH * TILES_ACROSS, intI * TILE_HEIGHT);
	
	fill("#00ff00");
	
	square(-45, -2, 40);
	
	noStroke();
	
	translate(-1, 0);
	
	
	for(var intI = 0; intI < TILES_ACROSS; intI++)//Draw Tiles
	{
		for(var intJ = 0; intJ < TILES_VERTICAL + 1; intJ++)
		{
			tilTile = tilTiles[intI][intJ];
			if(tilTile != null)
				tilTile.drawSelf(intI, intJ, false);
		}
	}
	
	drawNullTile(0, TILES_VERTICAL, false);
	
	
	//TODO Draw tiles select here
	
	if(mouseX > (windowWidth / 2) - (TILE_WIDTH * (TILES_ACROSS / 2)) && mouseX < TILE_WIDTH * TILES_ACROSS / 2 + (windowWidth / 2))
	{
		if(mouseY > 10 && mouseY < 10 + (TILE_HEIGHT * TILES_VERTICAL))
		{
			intAdjustedMouseX = mouseX - ((windowWidth / 2) - (TILE_WIDTH * (TILES_ACROSS / 2)));
			intAdujstedMouseY = mouseY - 10;
			
			intAdjustedMouseX = Math.floor(intAdjustedMouseX / TILE_WIDTH);
			intAdujstedMouseY = Math.floor(intAdujstedMouseY / TILE_HEIGHT);
			
			for(var intI = 0; intI < TILES_ACROSS; intI++)
				for(var intJ = TILES_VERTICAL - 2; intJ < TILES_VERTICAL; intJ++)
					drawNullTile(intI, intJ, false);
			
			if(tilSelectedTile != null)
			{
				tilSelectedTile.drawSelf(intAdjustedMouseX, intAdujstedMouseY, true);
			}else
			{
				drawNullTile(intAdjustedMouseX, intAdujstedMouseY, true);
			}
			
			if(mouseIsPressed && intAdujstedMouseY < TILES_VERTICAL - 2)
				tilTiles[intAdjustedMouseX][intAdujstedMouseY] = tilSelectedTile;
		}
		
		if(mouseY > 10 + (TILE_HEIGHT * TILES_VERTICAL) && mouseY < 10 + TILE_HEIGHT + (TILE_HEIGHT * TILES_VERTICAL))
		{
			intAdjustedMouseX = mouseX - ((windowWidth / 2) - (TILE_WIDTH * (TILES_ACROSS / 2)));
			intAdujstedMouseY = mouseY - 10;
			
			intAdjustedMouseX = Math.floor(intAdjustedMouseX / TILE_WIDTH);
			intAdujstedMouseY = Math.floor(intAdujstedMouseY / TILE_HEIGHT);
			
			if(mouseIsPressed)
				tilSelectedTile = tilTiles[intAdjustedMouseX][intAdujstedMouseY];
		}
	}
}

function drawNullTile(intX, intY, blnClear)
{
	push();
		
	clrColor = color(0);
	
	if(blnClear)
		clrColor.setAlpha(150);
	
	stroke(clrColor);
	strokeWeight(3);
	translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
	
	line(0, 0, TILE_WIDTH, TILE_HEIGHT);
	line(0, TILE_HEIGHT, TILE_WIDTH, 0);
	
	pop();
}

function levelToClipboard()
{
	strLevelString = "";
	blnKeyTile = false;
	blnLockedTile = false;
	intPortalCount = 0;
	
	for(var intI = 0; intI < TILES_ACROSS; intI++)
	{
		for(intJ = 0; intJ < TILES_VERTICAL; intJ++)
		{
			if(tilTiles[intI][intJ] == null)
			{
				strLevelString += "-";
				continue;
			}
			switch (tilTiles[intI][intJ].strType)
			{
				case "normal":
					strLevelString += "n";
					break;
				case "bomb":
					strLevelString += "b";
					break;
				case "time":
					strLevelString += "t";
					break;
				case "unbreakable":
					strLevelString += "u";
					break;
				case "key":
					strLevelString += "k";
					blnKeyTile = true;
					break;
				case "locked":
					strLevelString += "l";
					blnLockedTile = true;
					break;
				case "portal":
					strLevelString += "p";
					intPortalCount++;
					break;
				case "ball":
					strLevelString += "o";
					break;
			}
		}
	}
	
	if(blnLockedTile && !blnKeyTile)
	{
		//Error message
		return;
	}
	
	if(intPortalCount > 2 || intPortalCount == 1)
	{
		//Error message
		return;
	}
	
	navigator.clipboard.writeText(strLevelString);
	alert("Level copied to clipboard");
}