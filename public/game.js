var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 600;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var player1 = new Player1();
var player2 = new Player2();
var ball = new Ball(300, 200); //starting point of ball

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

var step = function() {
  update();
  render();
  animate(step);
};

// general setup
var render = function () {
  context.fillStyle = "#000"; // background color of canvas
  context.fillRect(0, 0, width, height);
  player1.render();
  player2.render();
  ball.render();
};


// -------------functions and render ---------------

function Bat(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Bat.prototype.render = function() {
  context.fillStyle = "#B22222"; //color of bats
  context.fillRect(this.x, this.y, this.width, this.height);
};

// starting position of right(player1) bat
function Player1() {
   this.bat = new Bat(580, 175, 13, 90);
}

// starting position of left(computer) bat
function Player2() {
  this.bat = new Bat (10, 175, 13, 90);
}

Player1.prototype.render = function() {
  this.bat.render();
};

Player2.prototype.render = function() {
  this.bat.render();
};

// ----------- Ball -----------------

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.y_speed = 0;
  this.x_speed = 3;
  this.radius = 10; //size of ball
}

// Bal styling
Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#FFA500"; // color of ball
  context.fill();
};

Ball.prototype.update = function(bat1, bat2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_y = this.y - 5;
  var top_x = this.x - 5;
  var bottom_y = this.y + 5;
  var bottom_x = this.x + 5;

  if(this.y - 5 < 0) { // ball hitting the bottom
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if(this.y + 5 > 400) { // ball hitting the top
    this.y = 395;
    this.y_speed = -this.y_speed;
  }

  if(this.x < 0 || this.x > 600) { // ball goes outside canvas
    this.y_speed = 0;
    this.x_speed = 3; //movement of ball after restart
    this.y = 200; //position of ball after restart
    this.x = 300;
  }

  if(top_x > 300) {
    if(top_x < (bat1.x + bat1.width) && top_x > bat1.x && bottom_y < (bat1.y + bat1.height) && top_y > bat1.y) {
      // hit the player's paddle and gets extra speed
      this.x_speed = -3;
      this.y_speed += (bat1.y_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if(top_x < (bat2.x + bat2.width) && top_x > bat2.x && bottom_y < (bat2.y + bat2.height) && top_y > bat2.y) {
      // hit the computer's paddle and gets extra speed
      this.x_speed = 3;
      this.y_speed += (bat2.y_speed / 2);
      this.x += this.x_speed;
    }
  }
};

// -------------- Movements ---------------------------
// ---------------Player1 Movements -------------------
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

Player1.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) { // left arrow
      this.bat.move(0, -4);
    } else if (value == 40) { // right arrow
      this.bat.move(0, 4);
    } else {
      this.bat.move(0, 0);
    }
  }
};

Bat.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) { // all the way to the bottom
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.height > 400) { // all the way to the top
    this.y = 400 - this.height;
    this.y_speed = 0;
  }
}

// ---------------Computer movements ---------------


var update = function() {
  player1.update();
  player2.update(ball);
  ball.update(player1.bat, player2.bat);
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

Player2.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 65) { // left arrow
      this.bat.move(0, -4);
    } else if (value == 90) { // right arrow
      this.bat.move(0, 4);
    } else {
      this.bat.move(0, 0);
    }
  }
};

Bat.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.y < 0) { // all the way to the bottom
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.height > 400) { // all the way to the top
    this.y = 400 - this.height;
    this.y_speed = 0;
  }
}
