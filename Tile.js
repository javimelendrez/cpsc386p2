/**
	* all different types of tiles
	*/
const TYPES = [
	"BARRIER",
	"OPEN",
	"BLOWUP",
	"CANDY",
  "BLOOEY",
  "RAT",
  "CLOOEY", 
  "STEAL",
  "END"
];

const TILE_SPEED = 0.2; // speed of tile's movement

const DIMENSIONS = 20;	// size of field

const SIZE = 25;	// size of each tile
const HALF_SIZE = SIZE / 2;
const THIRD_SIZE = SIZE / 3;
const QUARTER_SIZE = SIZE / 4;

/**
 * makes up the field
 * tiles can be moved
 * tiles can restrict movement
 */
function Tile(x, y, type, behavior) {

  this.x = x;
  this.y = y;
  this.type = type;

	this.destination = (-1, -1);
  this.moving = false;

  this.intact = true;

  this.speed = 0.1;

  this.behavior = behavior; // BLOOEY only;	0 = agressive, 1 = nonchalant
}

/**
 *	handles movement, eating, and AI
 */
Tile.prototype.update = function() {

  if (!this.intact) // no need to update
    return;

  /* movement */
  if (this.moving) {


    this.x = lerp(this.x, this.destination.x, this.speed);
    this.y = lerp(this.y, this.destination.y, this.speed);

	var distanceX = Math.abs(this.x - this.destination.x);
	var distanceY = Math.abs(this.y - this.destination.y);

    if (distanceX < 0.1 && distanceY < 0.1) { // round to the nearest position

      this.x = this.destination.x;
      this.y = this.destination.y;

      this.moving = false; // done moving
    }
  }

  /* eating */
  if (this.type == "RAT") { // only RAT may eat!

		// Tile to which Pac-man is moving
    var destinationTile = getTile(Math.floor(this.x), Math.floor(this.y));

    if (destinationTile.intact) {

      switch (destinationTile.type) {

        case "BLOWUP":
          score--;
          destinationTile.intact = false;
          break;

        case "CANDY":
          score++;	
          destinationTile.intact = false;
          break;

        case "STEAL":
          score = score / 2; //steal half of the candy
          destinationTile.intact = false;
          break;
          
                
        case "END":
          if(score >= 10)
            endGame(true);
          if(score < 10)
            endGame(false);
      }
    }

  } else if (this.type == "BLOOEY") {
    /* BLOOEY AI */

		var distance = dist(rat.x, rat.y, this.x, this.y);

    if (distance < 0.3) // if Pac-man has touched a BLOOEY
      endGame(false);

		/* movement */
    if (this.moving) // can't move multiple times at once
      return;

		/* relative possible movements */
    var possibleMoves = [

      getTile(this.x - 1, this.y),	// left
      getTile(this.x + 1, this.y),	// right
      getTile(this.x, this.y - 1),	// top
      getTile(this.x, this.y + 1),	// bottom
    ];

    /* sort by distance from Pac-man */
    possibleMoves.sort(function (a, b) {

      var aD = dist(a.x, a.y, rat.x, rat.y);
      var bD = dist(b.x, b.y, rat.x, rat.y);

      return aD - bD;
    });

    if (this.behavior === 0) {	// if they're agressive

      for (var i = 0; i < possibleMoves.length; i++) {

        if (this.move(possibleMoves[i].x, possibleMoves[i].y, false)) { // attempt to move
          break;
        }
      }
    } else {
			// move nonchalantly
      var index = Math.floor(random(4));
      this.move(possibleMoves[index].x, possibleMoves[index].y, false);
    }  

  } else if (this.type == "CLOOEY") {
    /* BLOOEY AI */

		var cdistance = dist(rat.x, rat.y, this.x, this.y);

    if (cdistance < 0.3) 
      score = score / 2;

		/* movement */
    if (this.moving) // can't move multiple times at once
      return;

		/* relative possible movements */
    var cpossibleMoves = [

      getTile(this.x - 1, this.y),	// left
      getTile(this.x + 1, this.y),	// right
      getTile(this.x, this.y - 1),	// top
      getTile(this.x, this.y + 1),	// bottom
    ];

    /* sort by distance from Pac-man */
    cpossibleMoves.sort(function (a, b) {

      var aD = dist(a.x, a.y, rat.x, rat.y);
      var bD = dist(b.x, b.y, rat.x, rat.y);

      return aD - bD;
    });

    if (this.behavior === 0) {	// if they're agressive

      for (var J = 0; J < cpossibleMoves.length; J++) {

        if (this.move(cpossibleMoves[J].x, cpossibleMoves[J].y, false)) { // attempt to move
          break;
        }
      }
    } else {
			// move nonchalantly
      var cindex = Math.floor(random(4));
      this.move(cpossibleMoves[cindex].x, cpossibleMoves[cindex].y, false);
    }

  }
};

Tile.prototype.draw = function() {

  switch (this.type) {

    case "BARRIER":

      strokeWeight(5);
      stroke(0);
      fill("#0000FF");
      rect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
      break;
      
    case "OPEN":
      noStroke();
      fill(255);
      break;

    case "BLOWUP":

      strokeWeight(5);
      stroke(0);
      fill("#0FF0FF");
      rect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
      break;

    case "STEAL":

      strokeWeight(5);
      stroke(0);
      fill("#0FF0FF");
      rect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
      break;

    case "CANDY":

      ellipseMode(CORNER);
      stroke(255);
      strokeWeight(2);
      fill("#FF2222");
      ellipse(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE);
      break;

    case "BLOOEY":

      fill("#FF00EE");
      stroke(0);
      strokeWeight(1);

			/* draw a triangle */
      beginShape();
      vertex(this.x * SIZE + HALF_SIZE, this.y * SIZE + QUARTER_SIZE);
      vertex(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + (QUARTER_SIZE * 3));
      vertex(this.x * SIZE + (QUARTER_SIZE * 3), this.y * SIZE + (QUARTER_SIZE * 3));
      endShape(CLOSE);
      break;

    case "CLOOEY":

      fill("#a9abca");
      stroke(0);
      strokeWeight(1);
  
      /* draw a triangle */
      beginShape();
      vertex(this.x * SIZE + HALF_SIZE, this.y * SIZE + QUARTER_SIZE);
      vertex(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + (QUARTER_SIZE * 3));
      vertex(this.x * SIZE + (QUARTER_SIZE * 3), this.y * SIZE + (QUARTER_SIZE * 3));
      endShape(CLOSE);
      break;

    case "RAT":

      ellipseMode(CORNER);
      stroke(0);
      strokeWeight(2);
      fill("#CC6600");
      ellipse(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE);
      break;

    case "END":

      strokeWeight(5);
      stroke(0);
      fill("#FF0000");
      rect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
      break;
  }

};

/**
 * calculates movement for use within update function
 * returns whether it's a valid move or not
 */
Tile.prototype.move = function(x, y, relative) {

  var destinationX, destinationY;

  if (relative) { // relative to the tile

    destinationX = this.x + x;
    destinationY = this.y + y;
  } else {

    destinationX = x;
    destinationY = y;
  }

  if (this.moving)
    return false;

  var destinationTile = getTile(destinationX, destinationY);

  var type = destinationTile.type;

  if ((type == "BARRIER" && this.type != "BARRIER") ||  // only certain tiles may
      (type == "BLOOEY" && this.type == "BLOOEY") ||
      (type == "CLOOEY" && this.type == "CLOOEY"))
    return false;
  
  if (this.type == "BLOOEY"){
    if (type == "BLOWUP" && this.type != "BLOWUP")
      return false;
  }
  if (this.type == "CLOOEY"){
    if (type == "STEAL" && this.type != "STEAL")
      return false;
  }

  this.moving = true; // begin movement next update
	this.destination = createVector(destinationX, destinationY);

  return true;
};

/**
 * returns tile with coordinates (x, y)
 */
function getTile(x, y) {

  return field[y * DIMENSIONS + x];
}