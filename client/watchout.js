// start slingin' some d3 here.

var options = {
  width: 500,
  height: 300
};

document.getElementsByClassName('game')[0].style.width = options.width;
document.getElementsByClassName('game')[0].style.height = options.height;

var game = d3.select('svg');

var updateEnemyPosition = function(positions) {
  var enemies = game.selectAll('.enemy').data(positions);

  enemies.transition().tween('side-effects', function() {
    return checkCollision;
  }).duration(500).attr('x', function(pos) {
    return pos.x;
  }).attr('y', function(pos) {
    return pos.y;
  });

  enemies.enter().append('image').attr({'xlink:href': 'asteroid.png', width: '20px', height: '20px', class: 'enemy'}).attr('x', function(pos) {
    return pos.x;
  }).attr('y', function(pos) {
    return pos.y;
  });

  enemies.exit().remove();
};

var randomPositions = function(n) {
  var results = [];
  for (var i = 0; i < n; i++) {
    results.push({x: Math.random() * options.width, y: Math.random() * options.height});
  }

  return results;
};

updateEnemyPosition(randomPositions(3));
setInterval(function() {
  updateEnemyPosition(randomPositions(3));
}, 1000);

game.on('mousemove', function() {
  // player move
  var playerPos = d3.mouse(this);
  var player = game.selectAll('.player').data([playerPos]);
  player.attr('cx', function(pos) { return pos[0]}).attr('cy', function(pos) { return pos[1] });
  player.enter().append('circle').attr({r: 20, class: 'player'});
  checkCollision();
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
  setScore();
}, 100);

var setScore = function() {
  d3.select('.current span').text(score);
  d3.select('.high span').text(highScore);
}
