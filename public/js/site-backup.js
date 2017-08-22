function d2R(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function calculateCenterAnnularArcLength(radii, angle) {
  var pi = Math.PI;
  var radius = (radii.outer - radii.inner) + radii.inner;
  return angle * radius;
}

var maxScore = 5;
var centerWeight = 0.2;
var diagramPercentage = 1;

function innerRadius(width, height) {
  var value = (Math.min(width, height) / 2) * centerWeight;

  return value * diagramPercentage;
}

function outerRadius(score, width, height) {
  if (score === 0) {
    score = 0.75;
  }
  var barWeight = 1 - centerWeight;
  var maxBarOuterRadius = (Math.min(width, height) / 2) * barWeight;
  var scorePercentage = score / maxScore;
  return ((maxBarOuterRadius * scorePercentage) + innerRadius(width, height)) * diagramPercentage;
}

function fontSize(width, height, text){
    return 8;
}

function colorForScore(score) {
  return {
    0: '#EC7063',
    1: '#EC7063',
    2: '#EB984E',
    3: '#F4D03F',
    4: '#58D68D',
    5: '#27AE60'
  }[score];
}

$(document).ready(function() {
  $('.report-pulsar').each(function() {
    draw($(this));
  });
});


function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

function draw(element) {

  var width = element.width();
  var height = element.height();

  var svg = d3.select(element.get(0))
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('overflow', 'visible');


  var pulsarData = element.data();
  var average = 0;
  var total = 0;
  var count = 0;
  var viewData = [];
  var angle = d2R(360 / pulsarData.keys.length);
  var nextAngle = 0;
  $.each(pulsarData.keys, function(i, val) {
    var key = val;
    var score = pulsarData.values[i];
    viewData.push({
      name: key,
      score: score,
      radii: {
        inner: innerRadius(width, height),
        outer: outerRadius(score, width, height)
      },
      angle: {
        start: nextAngle,
        end: nextAngle + angle
      }
    });
    count += 1;
    total += score;
    average = total / count;
    nextAngle += angle;
  });


  var g = svg.append('g').attr('transform',
    'translate(' + width / 2 + ',' + height / 2 + ')');

  var diagramGroup = g.append("g");

  var itemGroup = diagramGroup.append("g").selectAll('path')
    .data(function() {
      return viewData;
    })
    .enter();

  var arc = d3.arc()
    .innerRadius(function(d) {
      return d.radii.inner;
    })
    .outerRadius(function(d) {
      return d.radii.outer;
    })
    .startAngle(function(d) {
      return d.angle.start;
    })
    .endAngle(function(d) {
      return d.angle.end;
    })
    .padAngle(d2R(1));

  itemGroup.append('path')
    .attr('d', arc)
    .style('fill', function(d) {
      return colorForScore(d.score);
    })
    .style('opacity', 1);

  itemGroup.append("g").append("circle")
    .attr("cx", function(d) {
      var a = d.angle.start + (d.angle.end - d.angle.start) / 2 - Math.PI / 2;
      return Math.cos(a) * (d.radii.outer);
      //return d.x = Math.cos(a) * (r + 30);
    })
    .attr("cy", function(d) {
      var a = d.angle.start + (d.angle.end - d.angle.start) / 2 - Math.PI / 2;
      return Math.sin(a) * (d.radii.outer);
      //return d.y = Math.sin(a) * (r + 30);
    })
    .attr('r', function(d) {
      return 2;
    })
    .style('fill', 'black');


  var xCorrection = 15;
  var yCorrection = 15;
  var corrections = [{
    start: 0,
    end: 90,
    x: 15,
    y: -15
  },{
    start: 90,
    end: 180,
    x: 15,
    y: 15
  },{
    start: 180,
    end: 270,
    x: -15,
    y: 15
  },{
    start: 270,
    end: 360,
    x: -15,
    y: -15
  }]

  itemGroup.append("g").append("text")
    .attr("x", function(d) {
      var a = d.angle.start + (d.angle.end - d.angle.start) / 2 - Math.PI / 2;
      var value = Math.cos(a) * outerRadius(5, width, height);
      for(var correctionIndex in corrections){
        var correction = corrections[correctionIndex];
        if (d.angle.start >= d2R(correction.start) && d.angle.start < d2R(correction.end)){
            value += correction.x;
        }
      }
      return value;
    })
    .attr("y", function(d) {
      var a = d.angle.start + (d.angle.end - d.angle.start) / 2 - Math.PI / 2;
      var value = Math.sin(a) * outerRadius(5, width, height);
      for(var correctionIndex in corrections){
        var correction = corrections[correctionIndex];
        if (d.angle.start >= d2R(correction.start) && d.angle.start < d2R(correction.end)){
            value += correction.y;
        }
      }
      return value;
    })
    .attr('r', function(d) {
      return 2;
    })
    .attr('font-size',function(d){
        return fontSize(width, height, d.name)
    })
    .attr("text-anchor", "middle")
    .text(function(d){
        return d.name + ' ('+ d.score+')';    
    })
    .call(wrap, 50);

  diagramGroup.append("g").append('text')
    .attr('x', -6)
    .attr('y', 3)
    .attr('font-size', fontSize(width, height, average.toFixed(1).toString()))
    .text(average.toFixed(1).toString())


}
