// start slingin' some d3 here.

var options = {
  width: 500,
  height: 300
};

document.getElementsByClassName('game')[0].style.width = options.width;
document.getElementsByClassName('game')[0].style.height = options.height;

var updateEnemyPosition = function(positions) {
  var enemies = d3.select('.game').selectAll('image').data(positions)
  

  enemies.transition().duration(500).attr('x', function(pos) {
    return pos.x;
  }).attr('y', function(pos) {
    return pos.y;
  });

  enemies.enter().append('image').attr({'xlink:href': 'asteroid.png', width: '20px', height: '20px'}).attr('x', function(pos) {
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
}

setInterval(function() {
  updateEnemyPosition(randomPositions(3));
}, 1000);
