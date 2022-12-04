function normalTile()
{
	this.blnRequired = true;
	this.strType = "normal";
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color("#c4a756");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
		tilTiles[intX][intY] = null;
		balBall.tileSpeedUp();
		
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
		
		checkForEndOfLevel();
	}
}

function bombTile()
{
	this.blnRequired = true;
	this.strType = "bomb";
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color("#db1812");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
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
		balBall.tileSpeedUp();
		
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
		
		checkForEndOfLevel();
	}
}

function timeTile()
{
	this.blnRequired = true;
	this.strType = "time";
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color("#001fa8");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		clrColor = color("#e3d800");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		
		triangle(40, 22, 28, 4, 52, 4);
		triangle(40, 18, 28, 36, 52, 36);
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
		tilTiles[intX][intY] = null;
		
		for(var intI = 0; intI < balBalls.length; intI++)
		{
			balBalls[intI].intVelocity = MIN_VEL;
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
		
		checkForEndOfLevel();
	}
}

function unbreakableTile()
{
	this.blnRequired = false;
	this.strType = "unbreakable";
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color("#00cc0a");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		clrColor = color("#009c08");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		
		rect(TILE_WIDTH / 8, TILE_HEIGHT / 8, 6 * TILE_WIDTH / 8, 6 * TILE_HEIGHT / 8);
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
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

function keyTile()
{
	this.blnRequired = true;
	this.strType = "key";
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color("#9700c4");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		clrColor = color("#e3d800");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		push();
		noFill();
		strokeWeight(3);
		stroke(clrColor);
		circle(TILE_WIDTH / 2, 13, 8);
		line(TILE_WIDTH / 2, 17, TILE_WIDTH / 2, 28);
		line(TILE_WIDTH / 2, 28, (TILE_WIDTH / 2) + 4, 28);
		line(TILE_WIDTH / 2, 23, (TILE_WIDTH / 2) + 4, 23);
		
		pop();
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
		tilTiles[intX][intY] = null;
		balBall.tileSpeedUp();
		
		for(var intI = 0; intI < TILES_ACROSS; intI++)//Unlock locked tiles
		{
			for(var intJ = 0; intJ < TILES_VERTICAL; intJ++)
			{
				if(tilTiles[intI][intJ] != null)
				{
					if(tilTiles[intI][intJ].strType == "locked")
						tilTiles[intI][intJ] = new normalTile();
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
		
		checkForEndOfLevel();
	}
}

function lockedTile()
{
	this.blnRequired = true;
	this.strType = "locked";
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color(180);
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		clrColor = color(0);
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		
		circle(TILE_WIDTH / 2, (TILE_HEIGHT / 2) - 5, 10);
		triangle(TILE_WIDTH / 2, (TILE_HEIGHT / 2) - 10, (TILE_WIDTH / 2) - 5, TILE_HEIGHT - 8, (TILE_WIDTH / 2) + 5, TILE_HEIGHT - 8);
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
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

function portalTile()
{
	this.blnRequired = false;
	this.strType = "portal";
	this.intDestinationX = 0;
	this.intDestinationY = 0;
	
	this.setDestination = function(intX, intY)
	{
		this.intDestinationX = intX;
		this.intDestinationY = intY;
	}
	
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color("#7e00de");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		stroke("#32008a");
		strokeWeight(1);
		noFill();
		
		intDistanceFromCenter = 15;
		intPointDirection = 1;
		
		
		intCenterX = TILE_WIDTH / 2;
		intCenterY = TILE_HEIGHT / 2;
		
		beginShape();
		curveVertex(intCenterX, intCenterY - intDistanceFromCenter);
		curveVertex(intCenterX, intCenterY - intDistanceFromCenter);
		while(intDistanceFromCenter >= 0)
		{
			if(intPointDirection % 2 == 1)
				intA = pow(pow(intDistanceFromCenter, 2) / 2, 0.5);
			
			if(intPointDirection == 0)//Up
			{
				curveVertex(intCenterX, intCenterY - intDistanceFromCenter);
			}else if(intPointDirection == 1)//Up Left
			{
				curveVertex(intCenterX - intA, intCenterY - intA);
			}else if(intPointDirection == 2)//Left
			{
				curveVertex(intCenterX - intDistanceFromCenter, intCenterY);
			}else if(intPointDirection == 3)//Down Left
			{
				curveVertex(intCenterX - intA, intCenterY + intA);
			}else if(intPointDirection == 4)//Down
			{
				curveVertex(intCenterX, intCenterY + intDistanceFromCenter);
			}else if(intPointDirection == 5)//Down Right
			{
				curveVertex(intCenterX + intA, intCenterY + intA);
			}else if(intPointDirection == 6)//Right
			{
				curveVertex(intCenterX + intDistanceFromCenter, intCenterY);
			}else//Up Right
			{
				curveVertex(intCenterX + intA, intCenterY - intA);
			}
			
			intDistanceFromCenter -= 1;
			
			intPointDirection++;
			if(intPointDirection >= 8)
				intPointDirection = 0;
		}
		
		endShape();
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
		
		
		if(balBall != null)
		{
			if(balBall.intPortalCooldown <= 0)
				{
				intXDifference = (intX - this.intDestinationX) * TILE_WIDTH;
				intYDifference = (intY - this.intDestinationY) * TILE_HEIGHT;
				blnNoSides = true;
				
				dblNewBallX = balBall.dblCenterX - intXDifference;
				dblNewBallY = balBall.dblCenterY - intYDifference;
				
				if(dblNewBallX - BALL_RADIUS < 0 || dblNewBallX + BALL_RADIUS > BOARD_WIDTH_PIXLES || dblNewBallY - BALL_RADIUS < 0)
					blnNoSides = false;
				
				if(blnNoSides)
				{
					if(intDirection % 2 == 1)
					{
						if(tilTiles[Math.floor(dblNewBallX / TILE_WIDTH)][Math.floor((dblNewBallY + BALL_RADIUS) / TILE_HEIGHT)] == null)
						{
							if(tilTiles[Math.floor(dblNewBallX / TILE_WIDTH)][Math.floor((dblNewBallY - BALL_RADIUS) / TILE_HEIGHT)] == null)
							{
								balBall.intPortalCooldown = 10;
								balBall.dblCenterX = dblNewBallX;
								balBall.dblCenterY = dblNewBallY;
							}else
							{
								print("test1");
							}
						}else
						{
							print("test2");
						}
					}else
					{
						if(tilTiles[Math.floor((dblNewBallX + BALL_RADIUS) / TILE_WIDTH)][Math.floor(dblNewBallY / TILE_HEIGHT)] == null)
						{
							if(tilTiles[Math.floor((dblNewBallX - BALL_RADIUS) / TILE_WIDTH)][Math.floor(dblNewBallY / TILE_HEIGHT)] == null)
							{
								balBall.intPortalCooldown = 10;
								balBall.dblCenterX = dblNewBallX;
								balBall.dblCenterY = dblNewBallY;
							}else
							{
								print("test3");
							}
						}else
						{
							print("test4");
							print((balBall.dblCenterX + BALL_RADIUS) / TILE_WIDTH);
							print(balBall.dblCenterY / TILE_HEIGHT);
							print((dblNewBallX + BALL_RADIUS) / TILE_WIDTH);
							print(dblNewBallY / TILE_HEIGHT);
							print(intXDifference / TILE_WIDTH);
							print(intYDifference / TILE_HEIGHT);
						}
					}
				}
			}
			
			
			if(intDirection % 2 == 1)
			{
				balBall.bounceRightLeft();
			}else
			{
				balBall.bounceUpDown();
			}
		}
		
		checkForEndOfLevel();
	}
}

function ballTile()
{

	this.blnRequired = true;
	this.strType = "ball";
	this.drawSelf = function(intX, intY, blnClear)
	{
		push();
		
		clrColor = color("#eded00");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		translate(intX * TILE_WIDTH, intY * TILE_HEIGHT);
		
		rect(1, 1, TILE_WIDTH - 1, TILE_HEIGHT - 1);
		
		clrColor = color("#edc200");
		
		if(blnClear)
			clrColor.setAlpha(150);
		
		fill(clrColor);
		
		translate(10, 0);
		
		circle(TILE_WIDTH / 2, TILE_HEIGHT / 2, 20);
		
		stroke(0);
		strokeWeight(1);
		
		translate(-20, 0);
		
		line(TILE_WIDTH / 2 + 5, TILE_HEIGHT / 2, TILE_WIDTH / 2 - 5, TILE_HEIGHT / 2);
		line(TILE_WIDTH / 2, TILE_HEIGHT / 2 + 5, TILE_WIDTH / 2, TILE_HEIGHT / 2 - 5);
		
		pop();
	}
	
	this.hit = function(intX, intY, balBall, intDirection)//0=top, 1=right, 2=down, 3=left
	{
		tilTiles[intX][intY] = null;
		balBall.tileSpeedUp();
		
		throwNewBall(false);
		
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
		
		checkForEndOfLevel();
	}
}

