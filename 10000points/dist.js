function draw() {
  var t = canvas.node().getContext('2d')
  t.save(), t.clearRect(0, 0, width, height)
  for (var i = 0; i < points.length; ++i) {
    var n = points[i]
    ;(t.fillStyle = n.color), t.fillRect(n.x, n.y, pointWidth, pointWidth)
  }
  t.restore()
}
function animate(t) {
  points.forEach(function(t) {
    ;(t.sx = t.x), (t.sy = t.y)
  }), t(points), points.forEach(function(t) {
    ;(t.tx = t.x), (t.ty = t.y)
  }), (timer = d3.timer(function(t) {
    var i = Math.min(1, ease(t / duration))
    points.forEach(function(t) {
      ;(t.x = t.sx * (1 - i) + t.tx * i), (t.y = t.sy * (1 - i) + t.ty * i)
    }), draw(), 1 === i &&
      (timer.stop(), (currLayout = (currLayout + 1) % layouts.length), animate(
        layouts[currLayout]
      ))
  }))
}
var width = 900,
  height = 900,
  numPoints = 14e3,
  pointWidth = 4,
  pointMargin = 3,
  duration = 1500,
  ease = d3.easeCubic,
  timer,
  currLayout = 0,
  points = createPoints(numPoints, pointWidth, width, height),
  toGrid = function(t) {
    return gridLayout(t, pointWidth + pointMargin, width)
  },
  toSine = function(t) {
    return sineLayout(t, pointWidth + pointMargin, width, height)
  },
  toSpiral = function(t) {
    return spiralLayout(t, pointWidth + pointMargin, width, height)
  },
  toPhyllotaxis = function(t) {
    return phyllotaxisLayout(t, pointWidth + pointMargin, width / 2, height / 2)
  },
  layouts = [toSine, toPhyllotaxis, toSpiral, toPhyllotaxis, toGrid],
  screenScale = window.devicePixelRatio || 1,
  canvas = d3
    .select('body')
    .append('canvas')
    .attr('width', width * screenScale)
    .attr('height', height * screenScale)
    .style('width', width + 'px')
    .style('height', height + 'px')
    .on('click', function() {
      d3.select('.play-control').style('display', ''), timer.stop()
    })
canvas.node().getContext('2d').scale(screenScale, screenScale), toGrid(
  points
), draw(), d3
  .select('body')
  .append('div')
  .attr('class', 'play-control')
  .text('PLAY')
  .on('click', function() {
    animate(layouts[currLayout]), d3.select(this).style('display', 'none')
  })
