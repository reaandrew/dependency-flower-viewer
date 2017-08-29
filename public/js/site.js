//var projects = [];
//var packages = [];

//var numberOfProjects = getRandomArbitrary(1,100);
//var numberOfPackages = getRandomArbitrary(1,200);
/*
for (i = 0; i < numberOfPackages; i ++) {

    var pkg = {
        name : 'pkg'+(i+1)
    }
    packages.push(pkg);
}

for (j = 0; j < numberOfProjects; j ++) {
    var project = {
        name : 'project'+(j+1),
        pkgs: []
    }
    var pkgs = randomArray(getRandomArbitrary(1,numberOfPackages), numberOfPackages);
    for (i = 0; i < pkgs.length; i ++) {
        var pkg = {
            name : 'pkg'+(i+1)
        }
        project.pkgs.push(pkg);
    }
    projects.push(project);
}

$(document).ready(function() {
    draw($('#graph'));
});
*/

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function randomArray(length, max) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * max);
    });
}

function d2R(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function x(d, index, segment, radius, count){
      var gap = d2R((segment / 2) / Math.ceil(count/2));
      var useIndex = index % Math.ceil(count/2);
      var padding = d2R(segment/4);
      if (index >= (count/2)) {
        gap = d2R((segment / 2) / Math.floor(count/2));
        padding += d2R(segment);
        useIndex = index % Math.floor(count/2);
      }
      padding += gap/2;
      console.log('gap', ((segment / 2) / Math.ceil(count/2))) + (segment/4);
      var a = (gap * useIndex + padding) - Math.PI / 2;
      return Math.cos(a) * radius;
}

function y(d, index, segment, radius, count){
      var gap = d2R((segment / 2) / Math.ceil(count/2));
      var useIndex = index % Math.ceil(count/2);
      var padding = d2R(segment/4);
      if (index >= (count/2)) {
        gap = d2R((segment / 2) / Math.floor(count/2));
        padding += d2R(segment);
        useIndex = index % Math.floor(count/2);
      }
      padding += gap/2;
      var a = (gap * useIndex + padding)  - Math.PI / 2;
      return Math.sin(a) * radius;
}

function DependencyView(element){

    self.element = element;

    self.draw = function(viewModel){
        drawView($(element), viewModel.projects, viewModel.dependencies);
    }

    return self;
}

function drawView(element, projects, packages) {
  var width = $(element).width();
  var height = $(element).height();
  var segment = 180;
  var radius = Math.min(height, width)/1.5;

  var svg = d3.select(element.get(0))
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('overflow', 'visible');

  var g = svg.append('g').attr('transform',
    'translate(' + width / 2 + ',' + height / 2 + ')');

  var diagramGroup = g.append('g');

        console.log(packages);
  var packageGroup = diagramGroup.append('g').selectAll('circle')
    .data(function() {
        for (var i = 0; i< packages.length; i++){
            packages[i].x = x(undefined, i, segment, radius, packages.length);  
            packages[i].y = y(undefined, i, segment, radius, packages.length);  
        };
        return packages;
    })
    .enter();

  packageGroup.append('g').append('circle')
    .attr('cx', function(d, index) {
        return d.x; //x (d, index, segment, radius);
    })
    .attr('cy', function(d, index) {
        return d.y; // y (d, index, segment, radius);
    })
    .attr('r', function(d) {
      return 2;
    })
    .attr('id', function(d){
        return d.name;
    });

  packageGroup.append('g').append('text')
    .attr('x', function(d, index){
        /*
        var xValue = x(d, index, segment, radius) ;
        if (index >= (packages.length/2)) {
            return xValue;// + (-radius-xValue);
        }else{
            return xValue;// + (radius-xValue);
        }
        */
        return d.x;
    })
    .attr('y', function(d, index){
        return d.y;// y (d, index, segment, radius);
    })
    .attr("text-anchor", function(d, index){
        if (index >= (packages.length/2)) {
            return 'end';
        }else{
            return 'start';
        }
    })
    .attr('dx', function(d, index){
        if (index >= (packages.length/2)) {
            return -10;
        }else{
            return 10;
        }
    })
    .attr("dy", "0.25em")
    /*
    .attr('transform', function(d, index) { 
        var x = parseInt(d3.select(this).attr('x'));
        var y = parseInt(d3.select(this).attr('y'));

        var gap = (segment / 2) / Math.ceil(packages.length/2);
        if (index >= (packages.length/2)) {
            var rotation = ((gap * index) % 2) + 90;
        }else{
            var rotation = (gap * index)-45;
        }
        return 'rotate('+rotation+', '+(x)+', '+(y)+')';
    })
    */
    .text(function(d, index){
        return d.name;    
    });

  var projectGroup = diagramGroup.append('g').selectAll('path')
    .data(function() {
      return projects;
    })
    .enter();

  var textGroup = projectGroup.append('g');

  textGroup.append('rect')
    .attr('x', -(width/4/2))
    .attr('y', function(d, index){
        var gap = height / projects.length;
        var position = (index * gap) + gap / 2;
        return position - (height/projects.length/2) - (height/2);
    })
    .attr('width', width/4)
    .attr('height', (height/projects.length) - 2)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .on('mouseover', function(){
        d3.select(this.parentNode).selectAll('line').attr('stroke', 'black').style("stroke-opacity", 1);;
    })
    .on('mouseout', function(){
        d3.select(this.parentNode).selectAll('line').attr('stroke', 'lightgrey').style("stroke-opacity", 0.2);;
    });

  textGroup.append('text')
    .attr('x', 0)
    .attr('y', function(d, index){
        var gap = height / projects.length;
        var position = (index * gap) + gap / 2;
        return position - 1 - (height/2);
    })
    .attr("text-anchor", "middle")
    .attr("dy", "0.25em")
    .text(function(d, index){
        return d.name;    
    });

  textGroup.append('g').selectAll('line')
        .data(function(d){
            console.log('D', d);
            return d.packages;
        })
        .enter()
        .append('line')
        .attr('x1', function(d, index){
            return d3.select('#' + d.name).attr('cx');
        })
        .attr('y1', function(d, index){
            return d3.select('#' + d.name).attr('cy');
        })
        .attr('x2', function(d, index){
            var dimensions = d3.select(this.parentNode.parentNode).select('text').node().getBBox();
            if (index >= (packages.length/2)) {
                return d3.select(this.parentNode.parentNode).select('text').attr('x') - (width/4/2);
            }else{
                return d3.select(this.parentNode.parentNode).select('text').attr('x') + (width/4/2);
            }
        })
        .attr('y2', function(d, index){
            return d3.select(this.parentNode.parentNode).select('text').attr('y');
        })
        .attr("stroke-width", 1)
        .attr("stroke", "lightgrey")
        .style("stroke-opacity", 0.2);

}
