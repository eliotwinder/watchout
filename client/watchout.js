// start slingin' some d3 here.

var updateEnemyPosition = function(positions) {
  var enemies = d3.select('.game').selectAll('image').data(positions)
  
  enemies.attr('x', function(pos) {
    return pos.x;
  });
  
  enemies.attr('y', function(pos) {
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
  var bBox = document.getElementsByClassName('game')[0].getBBox();
  for (var i = 0; i < n; i++) {
    results.push({x: Math.random() * bBox.width, y: Math.random() * bBox.height});
  }

  return results;
}

setInterval(function() {
  updateEnemyPosition(randomPositions(3));
}, 1000);