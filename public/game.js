var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 800;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');


window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
};

var render = function () {
  context.fillStyle = "blue";
  context.fillRect(0, 0, width, height);
};

function Bat(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Bat.prototype.render = function() {
  context.fillStyle = "#0000FF";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.bat = new Bat(365, 580, 120, 13);
}

function Computer() {
  this.bat = new Bat (365, 10, 90, 13);
}

Player.prototype.render = function() {
  this.bat.render();
};

Computer.prototype.render = function() {
  this.bat.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 4;
  this.radius = 10;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#FFF";
  context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(400, 300);

var render = function() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);
  player.render();
  computer.render();
  ball.render();
}

var update = function() {
  ball.update();
};

Ball.prototype.update = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;
};

var update = function() {
  ball.update(player.bat, computer.bat);
};

Ball.prototype.update = function(bat1, bat2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 800) { // hitting the right wall
    this.x = 795;
    this.x_speed = -this.x_speed;
  }

  if(this.y < 0 || this.y > 600) { // a point was scored
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 400;
    this.y = 300;
  }

  if(top_y > 300) {
    if(top_y < (bat1.y + bat1.height) && bottom_y > bat1.y && top_x < (bat1.x + bat1.width) && bottom_x > bat1.x) {
      // hit the player's paddle
      this.y_speed = -3;
      this.x_speed += (bat1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (bat2.y + bat2.height) && bottom_y > bat2.y && top_x < (bat2.x + bat2.width) && bottom_x > bat2.x) {
      // hit the computer's paddle
      this.y_speed = 3;
      this.x_speed += (bat2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var update = function() {
  player.update();
  ball.update(player.bat, computer.bat);
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.bat.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.bat.move(4, 0);
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
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 800) { // all the way to the right
    this.x = 800 - this.width;
    this.x_speed = 0;
  }
}

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.bat, computer.bat);
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.bat.x + (this.bat.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.bat.move(diff, 0);
  if(this.bat.x < 0) {
    this.bat.x = 0;
  } else if (this.bat.x + this.bat.width > 800) {
    this.bat.x = 800 - this.bat.width;
  }
};
