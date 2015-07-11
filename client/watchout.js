// start slingin' some d3 here.


///// LOOK INTO d3timer



var options = {
  width: 1000,
  height: 800
};

document.getElementsByClassName('game')[0].style.width = options.width;
document.getElementsByClassName('game')[0].style.height = options.height;

var Vector = function(x, y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.dot = function(vec) {
  return this.x * vec.x + this.y * vec.y;
};

Vector.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

Vector.prototype.add = function(vec) {
  return new Vector( this.x + vec.x, this.y + vec.y);
};

Vector.prototype.normalize = function() {
  var length = this.length();
  return new Vector(this.x/length, this.y/length);
};

Vector.prototype.multiplyScalar = function(scalar) {
  return new Vector(this.x * scalar, this.y * scalar);
};

var randomEnemies = function(n) {
  var results = [];
  for (var i = 0; i < n; i++) {
    results.push({
      position: new Vector(Math.random() * options.width, Math.random() * options.height),
      direction: new Vector(1, 0),
      image: 'shuriken.svg'
    });
  }
  return results;
};

var moveEnemies = function(delta) {
  var speed = 0.1;
  speed *= delta;
  enemies.forEach(function (enemy) {
    var velocity = enemy.direction.normalize().multiplyScalar(speed); 
    // console.log(velocity);
    enemy.position = enemy.position.add(velocity);
  });
};

var redraw = function(positions) {
  var enemies = game.selectAll('.enemy').data(positions);
    enemies.attr('x', function(pos) {
    return pos.position.x;
  }).attr('y', function(pos) {
    return pos.position.y;
  });

  enemies.enter().append('image').attr({'xlink:href': 'shuriken.svg', class: 'shuriken enemy', width: '50px', height: '50px'})
    .attr('x', function(pos) { return pos.position.x; })
    .attr('y', function(pos) { return pos.position.y; })
    .attr('xlink:href', function(pos) { return pos.image; });

  enemies.exit().remove();
};

var game = d3.select('svg');
var numEnemies = 10;
var enemies = randomEnemies(numEnemies);

redraw(enemies);

var lastTime = 0;

d3.timer(function(now) {
  var delta = now - lastTime;
  lastTime = now;
  // console.log(delta);

  moveEnemies(delta);
  redraw(enemies);
  checkCollision();
});

game.on('mousemove', function() {
  // player move
  var playerPos = d3.mouse(this);
  var player = game.selectAll('.player').data([playerPos]);
  player.attr('cx', function(pos) { return pos[0]}).attr('cy', function(pos) { return pos[1] });
  player.enter().append('circle').attr({r: 10, fill: 'rgb(200, 200, 255)', class: 'player'});
});

var colliding = false;

var checkCollision = function() {
  var svg = document.getElementsByClassName('game')[0];
  var player = document.getElementsByClassName('player');

  if (player.length > 0) {
    var playerBox = player[0].getBBox();
    if (svg.getIntersectionList(playerBox, null).length > 1 ) {
      if (!colliding) {
        incrementCollisions();
      }
      colliding = true;
    } else {
      colliding = false;
    }
  }
};

var incrementCollisions = function() {
  d3.select('.collisions span').text(+d3.select('.collisions span').text() + 1);
  if (score > highScore) {
    highScore = score;
  }

  score = 0;
  setScore();
}

var score = 0;
var highScore = 0;
setInterval(function() {
  score++;
  if (score % 20 === 0) {
    numEnemies++;
  }
  setScore();
}, 100);

var setScore = function() {
  d3.select('.current span').text(score);
  d3.select('.high span').text(highScore);
}
