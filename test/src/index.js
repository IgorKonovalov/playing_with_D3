import * as d3 from 'd3'
import * as C from 'd3-contour'
import './main.scss'

function goldsteinPrice(x, y) {
  return (
    (1 +
      Math.pow(x + y + 1, 2) *
        (19 - 14 * x + 3 * x * x - 14 * y + 6 * x * x + 3 * y * y)) *
    (30 +
      Math.pow(2 * x - 3 * y, 2) *
        (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y * y))
  )
}

var n = 240, m = 125, values = new Array(n * m)
for (var j = 0.5, k = 0; j < m; ++j) {
  for (var i = 0.5; i < n; ++i, ++k) {
    values[k] = goldsteinPrice(i / n * 4 - 2, 1 - j / m * 3)
  }
}

var svg = d3.select('svg'),
  width = +svg.attr('width'),
  height = +svg.attr('height')

var thresholds = d3.range(1, 21).map(function(p) {
  return Math.pow(2, p)
})

var contours = C.contours().size([n, m]).thresholds(thresholds)

var color = d3.scaleLog().domain(d3.extent(thresholds)).interpolate(function() {
  return d3.interpolateYlGnBu
})

svg
  .selectAll('path')
  .data(contours(values))
  .enter()
  .append('path')
  .attr('d', d3.geoPath(d3.geoIdentity().scale(width / n)))
  .attr('fill', function(d) {
    return color(d.value)
  })

