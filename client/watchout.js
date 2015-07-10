// start slingin' some d3 here.

var enemies = d3.select('.game').selectAll('image').data([{x: 10, y:10}, {x: 20, y: 20}, {x: 30, y: 30}]).enter().append('image');
enemies.attr({'xlink:href': 'asteroid.png', width: '20px', height: '20px'});
enemies.attr('x', function(pos) {
  return pos.x;
});
enemies.attr('y', function(pos) {
  return pos.y;
});