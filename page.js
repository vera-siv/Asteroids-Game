/* ------------------- EECS 493 Assignment 3 Starter Code ------------------ */

/* ------------------------ GLOBAL HELPER VARAIBLES ------------------------ */
// Difficulty Helpers
let astProjectileSpeed = 3;            // easy: 1, norm: 3, hard: 5

// Game Object Helpers
let currentAsteroid = 1;
const AST_OBJECT_REFRESH_RATE = 15;
const maxPersonPosX = 1218;
const maxPersonPosY = 658;
const PERSON_SPEED = 5;                // #pixels each time player moves by
const portalOccurrence = 6000;         // portal spawns every 6 seconds
const portalGone = 3000;               // portal disappears in 3 seconds
const shieldOccurrence = 9000;         // shield spawns every 9 seconds
const shieldGone = 3000;               // shield disappears in 3 seconds

// Movement Helpers
let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;


let paused = false;
let dead = false;
let playerShielded = false;
let shielded;
let port;


let moveRocketInterval;
let createAsteroidsInterval;
let shieldInterval;
let portalInterval;
let collisionsInterval;
let scoreInterval;
let asteroids = [];


let spawnRate = 800;
let score = 0;
let danger = 20;
let level = 1;

let vol = 0.5;
const collectAudio = new Audio('./src/audio/collect.mp3');
const dieAudio = new Audio('./src/audio/die.mp3');

// TODO: ADD YOUR GLOBAL HELPER VARIABLES (IF NEEDED)

/* --------------------------------- MAIN ---------------------------------- */
$(document).ready(function () {
  rocket = $('#rocket');
  rocketPic = $('#rocketPic');
  
  // jQuery selectors
  game_window = $('.game-window');
  game_screen = $("#actual-game");
  asteroid_section = $('.asteroidSection');
  // hide all other pages initially except landing page

  //game_screen.hide(); // Comment me out when testing the spawn() effect below
  //$('#landing-page').hide();

  /* -------------------- ASSIGNMENT 2 SELECTORS BEGIN -------------------- */
  /*changing the level would be a loop*/



var slider = document.getElementById("myRange");
var output = document.getElementById("demo");

output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

$("#settings").on("click", function() {
  $("#settings-pop-up").show();
});

$("#close-button").on("click", function() {
  $("#settings-pop-up").hide();
});

$("#play").on("click", function() {
  if (paused) {
    $("#landing-page").hide();
    $("#actual-game").show();
    $("#paused-menu").show();
    $("#dark-overlay").show();
  }
  else {
    $("#tutorial-page").show();
  }
});

$("#pause").on("click", pause_function);
 
$("#resume-button").on("click", resume_function);

$("#exit-button").on("click", function() {
  $("#actual-game").hide();
  $("#paused-menu").hide();
  $("#dark-overlay").hide();

  $("#play").text("Resume game!");

  $("#landing-page").show();

});

$("#restart-button").on("click", function() {
   $("#paused-menu").hide();
   $("#restart-container").show();
});

$("#Nope").on("click", function() {
  $("#restart-container").hide();
  $("#paused-menu").show();
});

$("#Yup").on("click", function() {
  $("#restart-container").hide();
  $("#paused-menu").hide();
  $("#restarting").show();

  setTimeout(function() {
    $("#restarting").hide();
    $("#dark-overlay").hide();
    reset();
    startGame();
  }, 3000);
});


$("#myRange").on("input change", updateVol);
updateVol();

/*setTimeout() for 3 seconds first parameter is function name if true for keyboard
use isColliding fucntion and willCollide()

let sound = newAudio()*/

  /* --------------------- ASSIGNMENT 2 SELECTORS END --------------------- */

  // TODO: DEFINE YOUR JQUERY SELECTORS (FOR ASSIGNMENT 3) HERE

  $("#start").on("click", function() {
    reset();
    startGame();
  });
   


});





  // Example: Spawn an asteroid that travels from one border to another
  // spawn(); // Uncomment me to test out the effect!



/* ---------------------------- EVENT HANDLERS ----------------------------- */
function startGame() {

  if (difficultyLevel === "Easy") {
    astProjectileSpeed = 1;
    danger = 10;
    spawnRate = 1000;
  }
  else if (difficultyLevel === "Normal") {
    astProjectileSpeed = 3;
    danger = 20;
    spawnRate = 800;
  }
  else if (difficultyLevel === "Hard") {
    astProjectileSpeed = 5;
    danger = 30;
    spawnRate = 600;
  }


$('#dangerNum').text(danger);
$('#levelNum').text(level);
$('#scoreNum').text(score);

$("#tutorial-page").hide();
$("#landing-page").hide();
$("#game_right_section").show()
$("#greeting").show();


  setTimeout(function() {
  $("#greeting").hide();
  $("#rocket").show();
  $("#pause").show();

  moveRocketInterval = setInterval(moveRocket, 15);
  createAsteroidsInterval = setInterval(spawn, spawnRate);
  port = new Portal();
  portalInterval = setInterval(() => port.spawnPortal(), portalOccurrence);
  shielded = new Shield();
  shieldInterval = setInterval(() => shielded.spawnShield(), shieldOccurrence);
  collisionsInterval = setInterval(checkCollisions, 15);

  scoreInterval = setInterval(() => {
    score += 40;
    $('#scoreNum').text(score);
  }, 500);


  }, 3000);

}

function updateVol() {
  const val = $("#myRange").val();
  vol = val / 100;
  collectAudio.volume = vol;
  dieAudio.volume = vol;
}

function pause_function() {
    paused = true;

    clearInterval(scoreInterval);
    clearInterval(createAsteroidsInterval);
    clearInterval(shieldInterval);
    clearInterval(portalInterval);
    clearInterval(collisionsInterval);
    clearInterval(moveRocketInterval);


    $("#paused-menu").show();
    $("#dark-overlay").show();
    

   
}

function resume_function() {
  paused = false;

  moveRocketInterval = setInterval(moveRocket, 15);
  createAsteroidsInterval = setInterval(spawn, spawnRate);
  portalInterval = setInterval(() => port.spawnPortal(), portalOccurrence);
  shieldInterval = setInterval(() => shielded.spawnShield(), shieldOccurrence);
  collisionsInterval = setInterval(checkCollisions, 15);

  scoreInterval = setInterval(() => {
    score += 40;
    $('#scoreNum').text(score);
  }, 500);


  $("#paused-menu").hide();
  $("#dark-overlay").hide();

}


// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;

  if (e.key === "Escape") {
    if (!paused) {
      pause_function();
    }
  }

  if (e.key === " ") {
    if (paused) {
      resume_function();
      e.preventDefault();
    }
  }
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}


function moveRocket() {
  
  let yPosition = parseInt(rocket.css('top'));
  let xPosition = parseInt(rocket.css('left'));

  
  if (LEFT) {
   
    if ((xPosition - PERSON_SPEED) >= 0 ) {
      xPosition -= PERSON_SPEED;
    }
    else {
      xPosition = 0;
    }

    rocket.css('left', xPosition + 'px');

   if (playerShielded) {
      rocketPic.attr('src', './src/player/player_shielded_left.gif');
    }
    else {
    rocketPic.attr("src", "./src/player/player_left.gif");
    }

  }

  if (RIGHT) {
    if ((xPosition + PERSON_SPEED) <=maxPersonPosX) {
       xPosition += PERSON_SPEED;
    }
    else {
      xPosition = maxPersonPosX;
    }
   
    rocket.css('left', xPosition + 'px');

    if (playerShielded) {
      rocketPic.attr('src', './src/player/player_shielded_right.gif');
    }
    else {
    rocketPic.attr("src", "./src/player/player_right.gif");
    }


  }

  if (UP) {
    if ((yPosition - PERSON_SPEED) >= 0) {
      yPosition -= PERSON_SPEED;
    }
    else {
      yPosition = 0;
    }
    
    rocket.css('top', yPosition + 'px');

    if (playerShielded) {
      rocketPic.attr('src', './src/player/player_shielded_up.gif');
    }
    else {
    rocketPic.attr("src", "./src/player/player_up.gif");
    }

  }

  if (DOWN) {
    if ((yPosition + PERSON_SPEED) <= maxPersonPosY) {
       yPosition += PERSON_SPEED;
    }
    else {
      yPosition = maxPersonPosY;
    }

     rocket.css('top', yPosition + 'px');

    if (playerShielded) {
      rocketPic.attr('src', './src/player/player_shielded_down.gif');
    }
    else {
    rocketPic.attr("src", "./src/player/player_down.gif");
    }

  }

  if (!LEFT && !RIGHT && !UP && !DOWN) {
    if (playerShielded) {
      rocketPic.attr("src", "./src/player/player_shielded.gif");
    }
    else {
    rocketPic.attr("src", "./src/player/player.gif");
    }
  }

}



/* ------------------ ASSIGNMENT 2 EVENT HANDLERS BEGIN ------------------ */
let difficultyLevel = "Normal";

function changedisplay(clicked){
  const all = document.querySelectorAll('#button-options button');
  all.forEach(button => {
    button.classList.remove('selected');
  });
  clicked.classList.add('selected');

  difficultyLevel = clicked.innerText.trim();
}

/* ------------------- ASSIGNMENT 2 EVENT HANDLERS END ------------------- */
/*start game function intialize and restart/reset things do the rocket first*/

// TODO: ADD MORE FUNCTIONS OR EVENT HANDLERS (FOR ASSIGNMENT 3) HERE

class Portal {
  constructor() {
    this.portal = $("#portal");
    this.width = this.portal.width();
    this.height = this.portal.height();
  }

  spawnPortal() {
    const maxX = 1280 - this.width;
    const maxY = 720 - this.height;
    const x = Math.floor(getRandomNumber(0, maxX));
    const y = Math.floor(getRandomNumber(0, maxY));

    this.portal.css({left: x + "px", top: y + "px"});
    this.portal.show();

    setTimeout(() => {
      this.portal.hide();
    }, portalGone);
  }
}

class Shield {
  constructor() {
    this.shield = $("#shield");
    this.width = this.shield.width();
    this.height = this.shield.height();
  }

  spawnShield() {
    const maxX = 1280 - this.width;
    const maxY = 720 - this.height;
    const x = Math.floor(getRandomNumber(0, maxX));
    const y = Math.floor(getRandomNumber(0, maxY));

    this.shield.css({left: x + "px", top: y + "px"});
    this.shield.show();

    setTimeout(() => {
      this.shield.hide();
    }, shieldGone);
  }
}
 
function reset() {
  paused = false;
  score = 0; 
  level = 1;
  playerShielded = false;
  LEFT = RIGHT = UP = DOWN = false;

  $('.curAsteroid').remove();

  rocket.css({left: '640px', top: '360px'});
  rocketPic.attr("src", "./src/player/player.gif");

  $("#scoreNum").text(score);
  $("#levelNum").text(level);

  $("#rocket").hide();


  $("#actual-game").show();

   

}

function endGame() {
  $("#play").hide();
  $("#settings").hide();
  $("#final-score").text(score);
  $("#actual-game").hide();
  $("#landing-page").show();
  $("#game-over-page").show();

  $("#start-over").on("click", function() {
    $("#game-over-page").hide();
    $("#play").text("Play game!");
    $("#play").show();
    $("#settings").show();
});

}


function checkCollisions () {
  if (isColliding(rocket, shielded.shield) && shielded.shield.is(':visible')) {
    collectAudio.play();
    playerShielded = true;
    shielded.shield.hide();
  }

  else if (isColliding(rocket, port.portal) && port.portal.is(':visible')) {
    collectAudio.play();
    port.portal.hide();

    level += 1;
    danger += 2;
    astProjectileSpeed *= 1.5;

    $("#levelNum").text(level);
    $("#dangerNum").text(danger);
  }

  $('.curAsteroid').each(function () {
    const ast = $(this);

    if (isColliding(rocket, ast)) {
      if (playerShielded) {
        playerShielded = false;
        rocketPic.attr("src", "./src/player/player.gif");
      }

      else {
     
        dieAudio.play();
        rocketPic.attr("src", "./src/player/player_touched.gif");
        clearInterval(scoreInterval);
        clearInterval(createAsteroidsInterval);
        clearInterval(shieldInterval);
        clearInterval(portalInterval);
        clearInterval(collisionsInterval);
        clearInterval(moveRocketInterval);
        asteroids.forEach(id => clearInterval(id));
        asteroids = [];
    
      setTimeout(() => {
          endGame();
      }, 3000);
     
      }
    }

  });

 
}



/* ---------------------------- GAME FUNCTIONS ----------------------------- */
// Starter Code for randomly generating and moving an asteroid on screen
class Asteroid {
  // constructs an Asteroid object
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Asteroid div and append it to DOM so it can be modified later
    const objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAsteroid' > <img src = 'src/asteroid.png'/></div>";
    asteroid_section.append(objectString);
    // select id of this Asteroid
    this.id = $('#a-' + currentAsteroid);
    currentAsteroid++; // ensure each Asteroid has its own id
    // current x, y position of this Asteroid
    this.cur_x = 0; // number of pixels from right
    this.cur_y = 0; // number of pixels from top

    /*------------------------Private Member Variables------------------------*/
    // member variables for how to move the Asteroid
    this.x_dest = 0;
    this.y_dest = 0;
    // member variables indicating when the Asteroid has reached the border
    this.hide_axis = 'x';
    this.hide_after = 0;
    this.sign_of_switch = 'neg';
    // spawn an Asteroid at a random location on a random side of the board
    this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
    // get the current position of interest (either the x position or the y position):
    const cur_pos = this.hide_axis === "x" ? this.cur_x : this.cur_y;
    // determine if the asteroid has reached its destination:
    return this.sign_of_switch === "pos" ? (cur_pos > this.hide_after) : (cur_pos < this.hide_after);
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
    // ensures all asteroids travel at current level's speed
    this.cur_y += this.y_dest * astProjectileSpeed;
    this.cur_x += this.x_dest * astProjectileSpeed;
    // update asteroid's css position
    this.id.css('top', this.cur_y);
    this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
    // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
    const x = getRandomNumber(0, 1280);
    const y = getRandomNumber(0, 720);
    const floor = 784;
    const ceiling = -64;
    const left = 1344;
    const right = -64;
    const major_axis = Math.floor(getRandomNumber(0, 2));
    const minor_aix = Math.floor(getRandomNumber(0, 2));
    let num_ticks;

    if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      const bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      const bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
    }
    if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      const bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      const bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
    }
    // show this Asteroid's initial position on screen
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
    // normalize the speed s.t. all Asteroids travel at the same speed
    const speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
    this.x_dest = this.x_dest / speed;
    this.y_dest = this.y_dest / speed;
  }
}

// Spawns an Asteroid travelling from one side to another
function spawn() {
  console.log("spawning asteroid");
  // create an Asteroid object in the DOM
  const asteroid = new Asteroid();
  // move this Asteroid across the screen
  move(asteroid);
}

function move(asteroid) {
  // create an interval to move an Asteroid (i.e. repeatedly update an Asteroid's position)
   const astermovement = setInterval(function () {
    // HINT: Consider checking collision and other game states here
    if (paused) return;
    // update Asteroid position on screen
    asteroid.updatePosition();
    // determine whether Asteroid has reached its end position
    if (asteroid.hasReachedEnd()) { // i.e. outside the game border
      // remove this Asteroid from DOM (using jQuery .remove() method)
      asteroid.id.remove();
      // clear the interval that moves this Asteroid
      clearInterval(astermovement);
    }
   
      asteroids.push(astermovement);

  }, AST_OBJECT_REFRESH_RATE);
}

/* --------------------- Additional Utility Functions  --------------------- */
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
