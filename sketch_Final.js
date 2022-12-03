const TILE_WIDTH = 80;
const TILE_HEIGHT = 40;
const TILES_ACROSS = 12;
const TILES_VERTICAL = 15;
const BOARD_WIDTH_PIXLES = TILE_WIDTH * TILES_ACROSS;
const BOARD_HEIGHT_PIXLES = TILE_HEIGHT * TILES_VERTICAL;
const BALL_DIAMETER = 10;
const BALL_RADIUS = BALL_DIAMETER / 2;
const STARTING_VEL = 4;
const KILL_BARRIER_Y = BOARD_HEIGHT_PIXLES - 10;
const BAR_WIDTH = 20;

const tilTiles = [];
const balBalls = [];

var intMode = 0;//0=title screen, 1=main game, 2=level editor?,
var strLevels;
var intCurrentLevel = 0;
var intBarLength = 200;
var intLives = 3;
var intBarCenter = 400;


function preload() 
{
	strLevels = loadStrings("Levels.txt");
}

function setup()
{
	angleMode(DEGREES);
	createCanvas(windowWidth - 17, windowHeight);
	frameRate(50);
	
	for(var intI = 0; intI < TILES_ACROSS; intI++)
	{
		tilTiles[intI] = Array(TILES_VERTICAL).fill(null);
	}
	
	/**
	tilTiles[0][0] = new normalTile();
	tilTiles[1][0] = new normalTile();
	tilTiles[0][1] = new normalTile();
	tilTiles[1][1] = new bombTile();
	**/
	
	startOfLevel(0);
}


function startOfLevel(strLevelAdress)
{
	strLevelString = strLevels[strLevelAdress];
	strLevelName = "";
	intPointer = 0;
	
	while(strLevelString.charAt(intPointer) != '|')
	{
		strLevelName += strLevelString.charAt(intPointer);
		intPointer++;
	}
	
	intPointer++;
	
	for(var intI = 0; intI < TILES_ACROSS; intI++)
	{
		for(var intJ = 0; intJ < TILES_VERTICAL; intJ++)
		{
			var tilTile;
			
			switch (strLevelString.charAt(intPointer))
			{
				case 'n':
					tilTile = new normalTile();
					break;
				case 'b':
					tilTile = new bombTile();
					break;
				default:
					tilTile = null;
			}
			
			tilTiles[intI][intJ] = tilTile;
			intPointer++;
		}
	}
	
	print(strLevelName);
}

function throwNewBall()
{
	intLives--;
	print("You now have " + intLives + " lives left");
	
	if(intLives <= 0)
		gameOver();
	
	balBalls[0] = new ball(intBarCenter, BOARD_HEIGHT_PIXLES - (4 * BALL_DIAMETER), 130)
}

function gameOver()
{
	print("game over");
	intMode = 0;
}

function draw()
{
	background(0);
	
	translate((windowWidth / 2) - (TILE_WIDTH * (TILES_ACROSS / 2)), 10);//Translate to put board in correct place
	
	noFill();
	stroke(255);
	rect(-2, -2, TILE_WIDTH * TILES_ACROSS + 2, TILE_HEIGHT * TILES_VERTICAL + 2);//Place board
	noStroke();
	
	
	
	for(var intI = 0; intI < TILES_ACROSS; intI++)//Draw Tiles
	{
		for(var intJ = 0; intJ < TILES_VERTICAL; intJ++)
		{
			tilTile = tilTiles[intI][intJ];
			if(tilTile != null)
				tilTile.drawSelf(intI, intJ);
		}
	}
	
	for(var intI = 0; intI < balBalls.length; intI++)//Tick balls
	{
		if(balBalls[intI].tick())//Tick balls, check if they're out of bounds
		{
			for(var intJ = intI; intJ < balBalls.length - 1; intJ++)
				balBalls[intJ] = balBalls[intJ + 1];
			
			balBalls.length = balBalls.length - 1;
			intI--;
		}
	}
	
	if(balBalls.length <= 0)//Make sure there is at least one ball
		throwNewBall();
	
	for(var intI = 0; intI < balBalls.length; intI++)//Draw balls
		balBalls[intI].drawSelf();
		
		
	if(keyIsDown(37))//Left key
	{
		intBarCenter -= 20;
		
		if(intBarCenter < intBarLength / 2)
			intBarCenter = intBarLength / 2;
	}
	
	if(keyIsDown(39))//Right key
	{
		intBarCenter += 20;
		
		if(intBarCenter > BOARD_WIDTH_PIXLES - intBarLength / 2)
			intBarCenter = BOARD_WIDTH_PIXLES - intBarLength / 2;
	}
		
	if(mouseX != pmouseX || mouseY != pmouseY)//If mouse is moved
	{
		intAdjustedMouseX = mouseX - ((windowWidth / 2) - (BOARD_WIDTH_PIXLES / 2));
		
		intBarCenter = intAdjustedMouseX;//Move bar so it's center is on the same x
		
		if(intBarCenter < intBarLength / 2)
			intBarCenter = intBarLength / 2;
		
		if(intBarCenter > BOARD_WIDTH_PIXLES - intBarLength / 2)
			intBarCenter = BOARD_WIDTH_PIXLES - intBarLength / 2;
	}
	
	
	push();//Draw bar
	
	translate(intBarCenter - intBarLength / 2, BOARD_HEIGHT_PIXLES - BAR_WIDTH);
	
	fill(255);
	
	rect(0, 0, intBarLength, BAR_WIDTH);
	
}

function getTileAtPoint(intX, intY)//Returns a tileInfo object
{
	intGridX = Math.floor(intX / TILE_WIDTH);
	intGridY = Math.floor(intY / TILE_HEIGHT);
	
	tilTileAtPosition = tilTiles[intGridX][intGridY];
	
	tifReturn = new tileInfo(intGridX, intGridY, tilTileAtPosition);
	
	return tifReturn;
}

function tileInfo(intX, intY, tilBlock)//Exists only to let getTileAtPoint return multiple bits of data
{
	this.intGridX = intX;
	this.intGridY = intY;
	this.tilTile = tilBlock;
}

function ball(intX, intY, intHeading)
{
	this.dblCenterX = intX;
	this.dblCenterY = intY;
	this.intDirection = intHeading;
	
	this.intVelocity = STARTING_VEL;
	
	
	this.tick = function()//Returns true if ball goes out of bounds
	{
		dblNewX = this.dblCenterX + cos(this.intDirection) * this.intVelocity;
		dblNewY = this.dblCenterY - sin(this.intDirection) * this.intVelocity;
		
		if(dblNewY + BALL_RADIUS >= BOARD_HEIGHT_PIXLES - BAR_WIDTH && dblNewX <= intBarCenter + (intBarLength / 2) && dblNewX >= intBarCenter - (intBarLength / 2))
		{
			intDistanceFromBarEdge = (intBarLength / 2) + (dblNewX - intBarCenter);
			dblPercentOfBar = intDistanceFromBarEdge / intBarLength;
			dblPercentOfBar = 1 - dblPercentOfBar;
			intNewDirection = 45 + (dblPercentOfBar * 90);
			this.intDirection = intNewDirection;
			
			return false;
			
			//print("Distance from edge: " + intDistanceFromBarEdge + "\nPercent of bar: " + dblPercentOfBar + "\nNew Direction: " + intNewDirection);
			
		}else if(dblNewY >= KILL_BARRIER_Y)
		{
			return true;
		}else if(dblNewY - BALL_RADIUS <= 0)
		{
			this.bounceUpDown();
			return false;
		}else if(dblNewX - BALL_RADIUS <= 0 || dblNewX + BALL_RADIUS >= BOARD_WIDTH_PIXLES)
		{
			this.bounceRightLeft();
			return false;
		}
		
		var intSector;
		
		
		if(this.intDirection >= 0 && this.intDirection <= 90)
			intSector = 0;
		
		if(this.intDirection >= 90 && this.intDirection <= 180)
			intSector = 1;
		
		if(this.intDirection >= 180 && this.intDirection <= 270)
			intSector = 2;
		
		if(this.intDirection >= 270 && this.intDirection <=360)
			intSector = 3;
		
		if(intSector == 0)//Up/right
		{
			tifBottomRight = getTileAtPoint(dblNewX + BALL_RADIUS, dblNewY + BALL_RADIUS);
			if(tifBottomRight.tilTile != null)
			{
				tifBottomRight.tilTile.hit(tifBottomRight.intGridX, tifBottomRight.intGridY, this, 3);
				return false;
			}
			tifTopLeft = getTileAtPoint(dblNewX - BALL_RADIUS, dblNewY - BALL_RADIUS);
			if(tifTopLeft.tilTile != null)
			{
				tifTopLeft.tilTile.hit(tifTopLeft.intGridX, tifTopLeft.intGridY, this, 2);
				return false;
			}
			tifTopRight = getTileAtPoint(dblNewX + BALL_RADIUS, dblNewY - BALL_RADIUS);
			if(tifTopRight.tilTile != null)
			{
				intTilePointX = tifTopRight.intGridX * TILE_WIDTH;
				intTilePointY = (tifTopRight.intGridY + 1) * TILE_WIDTH;
				
				if(abs(intTilePointY - dblNewY) > abs(intTilePointX - dblNewX))
				{
					tifTopRight.tilTile.hit(tifTopRight.intGridX, tifTopRight.intGridY, this, 3);
				}else
				{
					tifTopRight.tilTile.hit(tifTopRight.intGridX, tifTopRight.intGridY, this, 2);
				}
				return false;
			}
		}
		
		if(intSector == 1)//Up/Left
		{
			tifTopRight = getTileAtPoint(dblNewX + BALL_RADIUS, dblNewY - BALL_RADIUS);
			if(tifTopRight.tilTile != null)
			{
				tifTopRight.tilTile.hit(tifTopRight.intGridX, tifTopRight.intGridY, this, 2);
				return false;
			}
			tifBottomLeft = getTileAtPoint(dblNewX - BALL_RADIUS, dblNewY + BALL_RADIUS);
			if(tifBottomLeft.tilTile != null)
			{
				tifBottomLeft.tilTile.hit(tifBottomLeft.intGridX, tifBottomLeft.intGridY, this, 1);
				return false;
			}
			tifTopLeft = getTileAtPoint(dblNewX - BALL_RADIUS, dblNewY - BALL_RADIUS);
			if(tifTopLeft.tilTile != null)
			{
				intTilePointX = (tifTopLeft.intGridX + 1) * TILE_WIDTH;
				intTilePointY = (tifTopLeft.intGridY + 1) * TILE_WIDTH;
				
				if(abs(intTilePointY - dblNewY) > abs(intTilePointX - dblNewX))
				{
					tifTopLeft.tilTile.hit(tifTopLeft.intGridX, tifTopLeft.intGridY, this, 1);
				}else
				{
					tifTopLeft.tilTile.hit(tifTopLeft.intGridX, tifTopLeft.intGridY, this, 2);
				}
				return false;
			}
		}
		
		if(intSector == 2)//Down/Left
		{
			tifBottomRight = getTileAtPoint(dblNewX + BALL_RADIUS, dblNewY + BALL_RADIUS);
			if(tifBottomRight.tilTile != null)
			{
				tifBottomRight.tilTile.hit(tifBottomRight.intGridX, tifBottomRight.intGridY, this, 0);
				return false;
			}
			tifTopLeft = getTileAtPoint(dblNewX - BALL_RADIUS, dblNewY - BALL_RADIUS);
			if(tifTopLeft.tilTile != null)
			{
				tifTopLeft.tilTile.hit(tifTopLeft.intGridX, tifTopLeft.intGridY, this, 1);
				return false;
			}
			tifBottomLeft = getTileAtPoint(dblNewX - BALL_RADIUS, dblNewY + BALL_RADIUS);
			if(tifBottomLeft.tilTile != null)
			{
				intTilePointX = (tifBottomLeft.intGridX + 1) * TILE_WIDTH;
				intTilePointY = tifBottomLeft.intGridY * TILE_WIDTH;
				
				if(abs(intTilePointY - dblNewY) > abs(intTilePointX - dblNewX))
				{
					tifBottomLeft.tilTile.hit(tifBottomLeft.intGridX, tifBottomLeft.intGridY, this, 1);
				}else
				{
					tifBottomLeft.tilTile.hit(tifBottomLeft.intGridX, tifBottomLeft.intGridY, this, 0);
				}
				return false;
			}
		}
		
		if(intSector == 3)//Down/Right
		{
			tifTopRight = getTileAtPoint(dblNewX + BALL_RADIUS, dblNewY - BALL_RADIUS);
			if(tifTopRight.tilTile != null)
			{
				tifTopRight.tilTile.hit(tifTopRight.intGridX, tifTopRight.intGridY, this, 3);
				return false;
			}
			tifBottomLeft = getTileAtPoint(dblNewX - BALL_RADIUS, dblNewY + BALL_RADIUS);
			if(tifBottomLeft.tilTile != null)
			{
				tifBottomLeft.tilTile.hit(tifBottomLeft.intGridX, tifBottomLeft.intGridY, this, 0);
				return false;
			}
			tifBottomRight = getTileAtPoint(dblNewX + BALL_RADIUS, dblNewY + BALL_RADIUS);
			if(tifBottomRight.tilTile != null)
			{
				intTilePointX = tifBottomRight.intGridX * TILE_WIDTH;
				intTilePointY = tifBottomRight.intGridY * TILE_WIDTH;
				if(abs(intTilePointY - dblNewY) > abs(intTilePointX - dblNewX))
				{
					tifBottomRight.tilTile.hit(tifBottomRight.intGridX, tifBottomRight.intGridY, this, 3);
				}else
				{
					tifBottomRight.tilTile.hit(tifBottomRight.intGridX, tifBottomRight.intGridY, this, 0);
				}
				return false;
			}
		}
		
		//Should only reach here if there were no bounces
		this.dblCenterX = dblNewX;
		this.dblCenterY = dblNewY;

		return false;
	}
	
	this.drawSelf = function()
	{
		push();
		
		fill(255);
		
		circle(this.dblCenterX, this.dblCenterY, BALL_DIAMETER);
		
		pop();
	}
	
	this.bounceRightLeft = function()
	{
		intNewDirection = 360 - this.intDirection;
		intNewDirection += 180;
		this.intDirection = intNewDirection % 360;
	}
	
	this.bounceUpDown = function()
	{
		intNewDirection = this.intDirection - 90;
		intNewDirection = 360 - intNewDirection;
		intNewDirection -= 90;
		this.intDirection = intNewDirection % 360;
	}
}


function normalTile()
{
	this.drawSelf = function(intX, intY)
	{
		push();
		fill("#c4a756");
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
		tilTiles[intX][intY] = null;
		
		if(balBall != null)
		{
			if(intDirection % 2 == 1)
			{
				balBall.bounceRightLeft();
			}else
			{
				balBall.bounceUpDown();
			}
		}
	}
}

function bombTile()
{
	this.drawSelf = function(intX, intY)
	{
		push();
		fill("#db1812");
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		translate(TILE_WIDTH / 2, TILE_HEIGHT / 2);
		fill(0);
		
		circle(0, 0, 20);
		
		strokeWeight(2);
		stroke(0);
		
		line(0, 0, -9, -9);
		
		strokeWeight(2);
		stroke("#de8912");
		
		line(-11, -10, -12, -10);
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
		tilTiles[intX][intY] = null;//Remove self
		
		for(var intI = intX - 1; intI < intX + 2; intI++)//Go through all adjacent tiles
		{
			for(var intJ = intY - 1; intJ < intY + 2; intJ++)
			{
				if(intI >= 0 && intJ >= 0 && intI < TILES_ACROSS && intJ < TILES_VERTICAL)//If the tile isn't off the edge of the board,
				{
					if(tilTiles[intI][intJ] != null)// and isn't null
					{
						tilTiles[intI][intJ].hit(intI, intJ, null, false);// act like it was just hit
					}
				}
			}
		}
		
		if(balBall != null)
		{
			if(intDirection % 2 == 1)
			{
				balBall.bounceRightLeft();
			}else
			{
				balBall.bounceUpDown();
			}
		}
		
	}
}

