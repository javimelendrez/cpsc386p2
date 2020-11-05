
/** 2D map of the field;
 * 0 = BARRIER
 * 1 = OPEN
 * 2 = BLOWUP
 * 3 = CANDY
 * 4 = BLOOEY
 * 5 = RAT
 */
const FIELD = [
  "5,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
  "0,1,1,1,1,3,1,1,1,3,1,1,1,1,0,1,1,3,1,0",
  "0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0",
  "0,1,0,1,1,1,1,3,0,3,1,1,1,1,1,1,1,0,1,0",
  "0,3,0,1,0,0,0,0,0,2,0,0,0,0,0,0,3,0,3,0",
  "0,1,0,3,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0",
  "0,1,0,1,0,1,1,3,1,1,1,1,1,1,1,0,1,0,1,0",
  "0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0",
  "0,1,0,1,0,1,1,1,1,1,4,1,1,1,1,0,1,1,3,0",
  "0,1,0,3,2,1,3,1,1,1,1,1,1,1,1,2,1,0,1,0",
  "0,3,0,0,0,1,1,1,1,1,1,1,1,3,1,0,1,0,1,0",
  "0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,3,0",
  "0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0",
  "0,1,0,3,0,1,1,1,1,1,3,1,1,1,1,0,1,1,1,0",
  "0,1,1,1,0,1,3,1,1,1,1,1,1,3,1,0,3,0,1,0",
  "0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0,1,0,1,0",
  "0,3,0,1,1,3,1,1,1,1,1,0,1,1,1,1,1,0,0,0",
  "0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0",
  "0,1,1,3,1,1,1,3,0,3,1,1,1,1,1,1,1,1,1,0",
  "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1",
];

var field = [];
var enemys = [];

var rat;
var score;
var endScore;

function setup() {

  createCanvas(500, 535);

  score = 0;
  field = generateField();
}

function draw() {

  background(51);

	drawHUD(); // field & score

	/* update and draw enemy */
  for (var j = 0; j < enemys.length; j++) {

    enemys[j].update();
    enemys[j].draw();
  }

	/* update and draw Pac-man */
	rat.update();
	rat.draw();

  handleInput(); // keyboard input
}

/**
 *	handles user input
 */
function handleInput() {

  if (keyIsDown(UP_ARROW)) {

    rat.move(0, -1, true);
  } else if (keyIsDown(DOWN_ARROW)) {

    rat.move(0, 1, true);
  } else if (keyIsDown(LEFT_ARROW)) {

    rat.move(-1, 0, true);
  } else if (keyIsDown(RIGHT_ARROW)) {

    rat.move(1, 0, true);
  }
}

/**
 * draws all tiles except types BLOOEY and RAT
 * draws score
 */
function drawHUD() {

	/* field */
	for (var i = 0; i < field.length; i++) {

		if (field[i].intact) {

			if (field[i].type != "BLOOEY" && field[i].type != "RAT")
				field[i].draw();
		}
	}

	/* score */
	noStroke();
  fill(255);
  textSize(30);
  textAlign(LEFT);
  text(score, 5, height - 5);
}

function endGame(won) {

  textSize(60);
  textAlign(CENTER);
  fill(255);
  stroke(0);
  strokeWeight(5);

  if (won) {

    text("You win!", width / 2, height / 2);
  } else {

    text("You lose!", width / 2, height / 2);
  }
  textSize(50);
  text("Press f5 to restart", width / 2, height / 2 + 50);

  noLoop();
}

/**
 *	populates field and ghost arrays
 * initializes Pac-man
 * based upon FIELD constant
 */
function generateField() {

  var f = []; // returning array

  var enemyId = 0; // handling behavior of ghost
  for (var i = 0; i < FIELD.length; i++) { // loop through each string

    var row = FIELD[i].split(",");
    for (var j = 0; j < row.length; j++) { // loop through numbers in string

      var type = TYPES[row[j]];
      var tile = new Tile(j, i, type, -1);

      switch (type) {

        case "RAT":
          rat = tile;
          f.push(new Tile(j, i, "OPEN"));
          break;

        case "BLOOEY":
					var behavior = (enemyId % 2); // every other ghost will be agressive
          enemys.push(new Tile(j, i, type, behavior));
          f.push(new Tile(j, i, "OPEN"));
          enemyId++;
          break;

        case "BARRIER":
          f.push(tile);
          break;

        case "OPEN":
          f.push(tile);
          break;
          
        case "CANDY":
          endScore++; // worth 10 points
          f.push(tile);
          break;

        case "BLOWUP":
          endScore--; // worth 1 point
          f.push(tile);
          break;
      }

    }
  }
  return f;
}
