// Mapbox API
var mapbox = "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2FybG9zLW1hcmluIiwiYSI6ImNqZ3ZsazNwZzBnbjEycG5xcjc1NTExbWYifQ.yuRpVniQRX-G7xjdbM2dgw";
var earthquakesData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
// Creating map object
var myMap = L.map("map", {
  center: [45, -97.67834301],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer(mapbox).addTo(myMap);

d3.json(earthquakesData, function(data){
  console.log(data);

var buildEarthquakeMap = function() {

   // Draw the world map boundaries
  d3.json(earthquakesData, function(err,world) {
    if (err) {
      throw err;
    }


  var projection = d3.geo.mercator()
      .scale((w - 1) / 2 / Math.PI)
      .translate([w/2, h/2]);
  
  
    // draw the earthquakes
    // first, make a color scale for the earthquakes
     var eqColorScale = d3.scale.linear()
               .domain([-1, 0, 1, 2, 3, 4, 5, 6, 9 ])
               .range(['#fff7ec','#fee8c8',
                     '#fdd49e','#fdbb84',
                     '#fc8d59','#ef6548',
                     '#d7301f','#b30000','#7f0000']);  
    
    d3.json(earthquakesData, function(err, json) {
      if (err) {
        throw err
      }
      
      // get the circle selection and add the data
      var circles = svg.selectAll("circle")
        .data(earthquakes);
      
      // on the enter selection, add x,y, radius, and color
      circles.enter()
        .append("circle")
        .attr("cx", function(d) {
              return projection(d.geometry.coordinates)[0];
            })
        .attr("cy", function(d) {
              return projection(d.geometry.coordinates)[1];
            })
        .attr("r", 0)
        .transition()
        .duration(1000)
        .delay(function(d,i){ return 200*i; })
        .ease('elastic')
        .attr("r", function(d) {
              return d.properties.mag;
            })
        .style("fill", function(d) {
                return eqColorScale(d.properties.mag);
            })
        .attr("class", "earthquake");
      
      // remove any exit selection
      circles.exit().remove();
    });  
    
    var path = d3.geo.path()
      .projection(projection);

var update = function() {
  buildEarthquakeMap();
//  buildMap();
};

window.addEventListener("resize", update);

update();
