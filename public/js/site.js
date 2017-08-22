$(document).ready(function() {
    draw($('#graph'));
});


function d2R(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function draw(element) {

  var width = 1000;
  var height = 500;
  var segment = 180;
  var radius = 250;


  var svg = d3.select(element.get(0))
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('overflow', 'visible');


  var g = svg.append('g').attr('transform',
    'translate(' + width / 2 + ',' + height / 2 + ')');


  //var projects = ['project1','project2','project3', 'project4', 'project5'];
  var projects = ['project1','project2','project3', 'project4'];
  var packages = ['pkg1','pkg2','pkg3', 'pkg4', 'pkg5', 'pkg6', 'pkg7', 'pkg8']
  
  var diagramGroup = g.append('g');

  var packageGroup = diagramGroup.append('g').selectAll('circle')
    .data(function() {
        return packages;
    })
    .enter();

  packageGroup.append('g').append('circle')
    .attr('cx', function(d, index) {
      var gap = d2R((segment / 2) / Math.ceil(packages.length/2));
      var useIndex = index % Math.ceil(packages.length/2);
      var padding = d2R(segment/4);
      if (index >= (packages.length/2)) {
        gap = d2R((segment / 2) / Math.floor(packages.length/2));
        padding += d2R(segment);
        useIndex = index % Math.floor(packages.length/2);
      }
      padding += gap/2;
      var a = (gap * useIndex + padding) - Math.PI / 2;
      return Math.cos(a) * radius;
    })
    .attr('cy', function(d, index) {
      var gap = d2R((segment / 2) / Math.ceil(packages.length/2));
      var useIndex = index % Math.ceil(packages.length/2);
      var padding = d2R(segment/4);
      if (index >= (packages.length/2)) {
        gap = d2R((segment / 2) / Math.floor(packages.length/2));
        padding += d2R(segment);
        useIndex = index % Math.floor(packages.length/2);
      }
      padding += gap/2;
      var a = (gap * useIndex + padding)  - Math.PI / 2;
      return Math.sin(a) * radius;
    })
    .attr('r', function(d) {
      return 2;
    })
/*
  packageGroup.append('g').append('text')
    .attr('x', function(d, index){
      var gap = d2R(segment / packages.length / 2);
      var padding = d2R(segment/4);
      if (index > (packages.length/2)) {
        padding += d2R(segment);
      }
      var a = (gap * index + (gap/2) + padding) - Math.PI / 2;
      return Math.cos(a) * radius;
    })
    .attr('y', function(d, index){
      var gap = d2R(segment / packages.length / 2);
      var padding = d2R(segment/4);
      if (index > (packages.length/2)) {
        padding += d2R(segment/2);
      }
      var a = (gap * index + (gap/2) + padding)  - Math.PI / 2;
      return Math.sin(a) * radius;
    })
    .text(function(d, index){
        return d;    
    });
*/

  var itemGroup = diagramGroup.append('g').selectAll('path')
    .data(function() {
      return projects;
    })
    .enter();

  itemGroup.append('g').append('text')
    .attr('x', 0)
    .attr('y', function(d, index){
        var gap = height / projects.length;
        var position = (index * gap) + gap / 2;
        return position - (height/2);
    })
    .attr("text-anchor", "middle")
    .text(function(d, index){
        return d;    
    });
}
