const TILE_WIDTH = 80;
const TILE_HEIGHT = 40;
const TILES_ACROSS = 12;
const TILES_VERTICAL = 15;
const BOARD_WIDTH_PIXLES = TILE_WIDTH * TILES_ACROSS;
const BOARD_HEIGHT_PIXLES = TILE_HEIGHT * TILES_VERTICAL;
const BALL_DIAMETER = 10;
const BALL_RADIUS = BALL_DIAMETER / 2;
const STARTING_VEL = 5;
const MIN_VEL = 4;
const MAX_VEL = 12;
const KILL_BARRIER_Y = BOARD_HEIGHT_PIXLES - 10;
const BAR_WIDTH = 20;
const MAX_BAR_SIZE = 500;
const MIN_BAR_SIZE = 100;

const tilTiles = [];
const balBalls = [];

var intMode = 0;//0=title screen, 1=main game
var strLevels;
var intCurrentLevel = 0;
var intBarLength = 500;
var intLives = 3;
var intBarCenter = 400;
var blnKillKeyDownLastTick = false;
var blnLevelOver = false;
var blnSingleLevel = false;


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
	
}

function checkForEndOfLevel()
{
	blnLevelOver = true;
	
	for(var intI = 0; intI < TILES_ACROSS; intI++)
	{
		for(var intJ = 0; intJ < TILES_VERTICAL; intJ++)
		{
			if(tilTiles[intI][intJ] != null)
			{
				if(tilTiles[intI][intJ].blnRequired)
					blnLevelOver = false;
			}
		}
	}

}

function startGame(intStartingLevel)
{
	intLives = 4;
	intMode = 1;
	intBarLength = 250;
	intCurrentLevel = intStartingLevel;
	startOfLevel(intStartingLevel);
}


function startOfLevel(intLevelAdress)
{
	if(strLevels[intLevelAdress] == "")
	{
		intMode = 0;
	}else
	{
		startLevel(strLevels[intLevelAdress]);
	}
}

function startLevel(strLevelString)
{
	strLevelName = "";
	intPointer = 0;
	intLives += 2;
	intBarLength -= 50;
	if(intBarLength < MIN_BAR_SIZE)
		intBarLength = MIN_BAR_SIZE;
	
	while(strLevelString.charAt(intPointer) != '|')
	{
		strLevelName += strLevelString.charAt(intPointer);
		intPointer++;
	}
	
	intPointer++;
	
	intPortalX = 0;
	intPortalY = 0;
	blnPortalPlaced = false;
	
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
				case 't':
					tilTile = new timeTile();
					break;
				case 'u':
					tilTile = new unbreakableTile();
					break;
				case 'k':
					tilTile = new keyTile();
					break;
				case 'l':
					tilTile = new lockedTile();
					break;
				case 'p':
					tilTile = new portalTile();
					if(blnPortalPlaced)
					{
						tilTile.setDestination(intPortalX, intPortalY);
						tilTiles[intPortalX][intPortalY].setDestination(intI, intJ);
					}else
					{
						blnPortalPlaced = true;
						intPortalX = intI;
						intPortalY = intJ;
					}
					break;
				case 'o':
					tilTile = new ballTile();
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

function throwNewBall(blnLifeDown)
{
	if(blnLifeDown)
		intLives--;
	
	
	
	if(intLives <= 0)
		gameOver();
	
	balBalls[balBalls.length] = new ball(intBarCenter, BOARD_HEIGHT_PIXLES - (4 * BALL_DIAMETER), 130)
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
	
	if(intMode == 0)//Title screen
	{
		push();
		textAlign(CENTER, TOP);
		textSize(50);
		intMouseOnText = 0;//0=None, 1=Start Game, 2=LevelSelect
		rectMode(CORNERS);
		
		intAdjustedMouseX = mouseX - ((windowWidth / 2) - (TILE_WIDTH * (TILES_ACROSS / 2)));
		intAdjustedMouseY = mouseY - 10;
		
		if(intAdjustedMouseX > (BOARD_WIDTH_PIXLES / 2) - 125 && intAdjustedMouseX < (BOARD_WIDTH_PIXLES / 2) + 125 && intAdjustedMouseY > (BOARD_HEIGHT_PIXLES / 2) - 50 && intAdjustedMouseY < BOARD_HEIGHT_PIXLES / 2)
		{
			fill("#fff200");
			intMouseOnText = 1;
		}else
		{
			fill(255);
		}
		
		text("Start Game", BOARD_WIDTH_PIXLES / 2, BOARD_HEIGHT_PIXLES / 2 - 50);
		
		if(intAdjustedMouseX > (BOARD_WIDTH_PIXLES / 2) - 135 && intAdjustedMouseX < (BOARD_WIDTH_PIXLES / 2) + 135 && intAdjustedMouseY > (BOARD_HEIGHT_PIXLES / 2) + 10 && intAdjustedMouseY < BOARD_HEIGHT_PIXLES / 2 + 60)
		{
			fill("#fff200");
			intMouseOnText = 2;
		}else
		{
			fill(255);
		}
		
		
		text("Level Select", BOARD_WIDTH_PIXLES / 2, BOARD_HEIGHT_PIXLES / 2 + 10);
		noFill();
		stroke(255);
		strokeWeight(2);
		rect((BOARD_WIDTH_PIXLES / 2) - 125, (BOARD_HEIGHT_PIXLES / 2) - 50, BOARD_WIDTH_PIXLES / 2 + 125, BOARD_HEIGHT_PIXLES / 2);//Start game
		rect((BOARD_WIDTH_PIXLES / 2) - 135, (BOARD_HEIGHT_PIXLES / 2) + 60, BOARD_WIDTH_PIXLES / 2 + 135, BOARD_HEIGHT_PIXLES / 2 + 10);
		
		
		
		
		if(mouseIsPressed)
		{
			if(intMouseOnText == 1)
				startGame(0);
			
			if(intMouseOnText == 2)
				intMode = 2;
		}
		
		
		pop();
		
		
	}
	else if(intMode == 1)
	{
		for(var intI = 0; intI < TILES_ACROSS; intI++)//Draw Tiles
		{
			for(var intJ = 0; intJ < TILES_VERTICAL; intJ++)
			{
				tilTile = tilTiles[intI][intJ];
				if(tilTile != null)
					tilTile.drawSelf(intI, intJ, false);
			}
		}
		
		push();
		fill(255);
		textSize(30);
		text(strLevelName, 0, BOARD_HEIGHT_PIXLES + 30);
		textAlign(RIGHT);
		text("Lives: " + intLives, BOARD_WIDTH_PIXLES, BOARD_HEIGHT_PIXLES + 30);
		pop();
		
		if(balBalls.length <= 0)//Make sure there is at least one ball
			throwNewBall(true);
		
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
		
		for(var intI = 0; intI < balBalls.length; intI++)//Draw balls
			balBalls[intI].drawSelf();
			
		if(keyIsDown(75) && !blnKillKeyDownLastTick)//Dev cheat
		{
			blnKillKeyDownLastTick = true;
			for(var intI = 0; intI < TILES_ACROSS; intI++)
			{
				for(var intJ = 0; intJ < TILES_VERTICAL; intJ++)
				{
					if(tilTiles[intI][intJ] != null)
						tilTiles[intI][intJ].hit(intI, intJ, null, 0);
				}
			}
		}else if(!keyIsDown(75))
		{
			blnKillKeyDownLastTick = false;
		}
			
			
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
		
		if(blnLevelOver)
		{
			balBalls.length = 0;
			
			if(!blnSingleLevel)
			{
				intCurrentLevel++;
				startOfLevel(intCurrentLevel);
			}else
			{
				intMode = 0;
			}
			blnLevelOver = false;
		}
	}
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
	this.intPortalCooldown = 0;
	this.intTilesSinceLastSpeedUp = 0;
	
	this.intVelocity = STARTING_VEL;
	
	this.tileSpeedUp = function()
	{
		if(this.intTilesSinceLastSpeedUp > 20 && this.intVelocity < MAX_VEL)
		{
			this.intVelocity++;
			this.intTilesSinceLastSpeedUp = 0;
		}
		this.intTilesSinceLastSpeedUp++;
	}
	
	
	this.tick = function()//Returns true if ball goes out of bounds
	{
		this.intPortalCooldown--;
		if(this.intPortalCooldown < 0)
			this.intPortalCooldown = 0;
		dblNewX = this.dblCenterX + cos(this.intDirection) * this.intVelocity;
		dblNewY = this.dblCenterY - sin(this.intDirection) * this.intVelocity;
		
		if(dblNewY + BALL_RADIUS >= BOARD_HEIGHT_PIXLES - BAR_WIDTH && dblNewX <= intBarCenter + (intBarLength / 2) && dblNewX >= intBarCenter - (intBarLength / 2))//If ball hits the bar
		{
			intDistanceFromBarEdge = (intBarLength / 2) + (dblNewX - intBarCenter);
			dblPercentOfBar = intDistanceFromBarEdge / intBarLength;
			dblPercentOfBar = 1 - dblPercentOfBar;
			intNewDirection = 45 + (dblPercentOfBar * 90);
			this.intDirection = intNewDirection;
			
			return false;
		}else if(dblNewY >= KILL_BARRIER_Y)//If ball is out of bounds
		{
			return true;
		}else if(dblNewY - BALL_RADIUS <= 0)//If ball hits top of play area
		{
			this.bounceUpDown();
			return false;
		}else if(dblNewX - BALL_RADIUS <= 0 || dblNewX + BALL_RADIUS >= BOARD_WIDTH_PIXLES)//If ball hits side of play area
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
