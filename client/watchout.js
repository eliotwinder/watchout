// start slingin' some d3 here.


///// LOOK INTO d3timer



var options = {
  width: 1000,
  height: 800,
  // if distance between enemies is less than localCutoff, the enemy steers away
  localCutoff: 20,
  cohesionWeight: 10,
  separationWeight: 15,
  alignmentWeight: 10,
  goalWeight: 2
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

Vector.prototype.subtract = function(vec) {
  return new Vector( this.x - vec.x, this.y - vec.y);
};

Vector.prototype.normalize = function() {
  var length = this.length();
  if (length === 0) {
    return new Vector(0, 0);
  }

  return this.divideScalar(length);
};

Vector.prototype.multiplyScalar = function(scalar) {
  return new Vector(this.x * scalar, this.y * scalar);
};

Vector.prototype.divideScalar = function(scalar) {
  return new Vector(this.x / scalar, this.y / scalar);
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
  var speed = 0.2;
  speed *= delta;

  var averagePosition = enemies.reduce(function(total, current) {
    return total.add(current.position);
  }, new Vector(0, 0)).divideScalar(enemies.length);

  var alignmentVector = new Vector(0, 0);

  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    var direction = enemy.direction;
    var separatingVector = new Vector(0, 0);

    for (var j = 0; j < enemies.length; j++) {
      var otherEnemy = enemies[j];
      if (otherEnemy !== enemy) {
        var displacement = otherEnemy.position.subtract(enemy.position);

        if (displacement.length() < options.localCutoff) {
          separatingVector = separatingVector.subtract(displacement);
          alignmentVector = alignmentVector.add(otherEnemy.direction.normalize());
        }
      }
    };

    var cohesionVector = averagePosition.subtract(enemy.position);
    var goalVector = mouse.subtract(enemy.position);

    // direction = sum of the four rules normalized and weighted
    // direction = separatingVector.normalize();
    enemy.direction = separatingVector.normalize().multiplyScalar(options.separationWeight)
      .add(cohesionVector.normalize().multiplyScalar(options.cohesionWeight))
      .add(alignmentVector.normalize().multiplyScalar(options.alignmentWeight))
      .add(goalVector.normalize().multiplyScalar(options.goalWeight)).normalize();

    var velocity = enemy.direction.normalize().multiplyScalar(speed);
    enemy.position = enemy.position.add(velocity);
  }
};

var redraw = function(positions) {
  var enemies = game.selectAll('.enemy').data(positions);
    enemies.attr('x', function(pos) {
    return pos.position.x;
  }).attr('y', function(pos) {
    return pos.position.y;
  });

  enemies.enter().append('image').attr({'xlink:href': 'shuriken.svg', class: 'shuriken enemy', width: '20px', height: '20px'})
    .attr('x', function(pos) { return pos.position.x; })
    .attr('y', function(pos) { return pos.position.y; })
    .attr('xlink:href', function(pos) { return pos.image; });

  enemies.exit().remove();
};

var game = d3.select('svg');
var numEnemies = 100;
var enemies = randomEnemies(numEnemies);

redraw(enemies);

var lastTime = 0;

d3.timer(function(now) {
  var delta = now - lastTime;
  lastTime = now;
  // console.log(delta);

  moveEnemies(delta);
  redraw(enemies);
  // checkCollision();
});

var mouse = new Vector(0,0);

game.on('mousemove', function() {
  // player move
  var playerPos = d3.mouse(this);
  mouse = new Vector(playerPos[0], playerPos[1]);
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
