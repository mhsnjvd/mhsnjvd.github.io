// Takes  an SVG element and makes a histogram
// using data given in dataSet.  dataSet must be
// an array with each element of the array having two 
// properties x and y. x can be numeric
// or string, y has to be numeric.
// The histogram also adds x and y axis 
// to the SVG
function histogram(svgID, dataSet)
{
    // Select the SVG object:
     var svg = d3.select(svgID);
     
     // background color
     svg.style("background-color", "whitesmoke");

     var height = svg.attr("height");
     var width  = svg.attr("width");
     var padding = 10;
     var topMargin = height/10;
     var rightMargin = width/20;
     var bottomMargin = height/10;
     var leftMargin = width/20;

     var margin = {top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin};

     // x and y data from data set:
     var xData = dataSet.map( function(d){ return d.x; });
     var yData = dataSet.map( function(d){ return d.y; });

     // Prepare the scales:
     var xScale = d3.scale.ordinal()
             .domain(d3.range(xData.length))
             .rangeRoundBands( [margin.left, width - margin.right], .1 );

     var minyData = d3.min(yData);
     var maxyData = d3.max(yData); 

     // Reversed y-scale as the coordinates of y 
     // are reversed on a screen
     var yScale = d3.scale.linear()
              .domain([minyData, maxyData])
              .range([height-margin.top, margin.bottom]);

     var hScale = d3.scale.linear()
              .domain([minyData, maxyData])
              .range([0, height-margin.top-margin.bottom]);
     

    // Draw the rectangles: 
     var bars = svg.selectAll("rect")
    .data(yData)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return yScale(d);})
    .attr("height", function(d) { return hScale(d); })
    .attr("width", function(d) { return xScale.rangeBand(); })
    .attr("fill", "steelblue");

     // Functions for mouse-over and mouse-out:

     bars.on("mouseover", function(d)
            {
                d3.select(this)
                .transition()
                .duration(150)
                .attr("fill", "blue");
                return;
            });

    bars.on("mouseout", function(d)
            {
                d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "steelblue");
                return;
            });
   // Define the axes
    var xAxis = d3.svg.axis().scale(xScale)
            .orient("bottom")//.ticks(4);
    xAxis.tickFormat("");

    var yAxis = d3.svg.axis().scale(yScale)
            .orient("left").ticks(10);
    // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height-margin.bottom) + ")")
    .call(xAxis);

    // Remove X Axis text
    svg.call(xAxis).selectAll("text").remove();

    // Add the Y Axis
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);
};

// Takes  an SVG element and makes a line plot
// using data given in dataSet.  dataSet must be
// an array with each element of the array having two 
// properties x and y. Both x and y
// have to be numeric.
function plot(svgID, dataSet)
{
     var svg = d3.select(svgID);

     // background color
     svg.style("background-color", "whitesmoke");

     var height = svg.attr("height");
     var width  = svg.attr("width");
     var padding = 10;
     var topMargin = height/10;
     var rightMargin = width/20;
     var bottomMargin = height/10;
     var leftMargin = width/20;

     var margin = {top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin};


     // x and y data from data set:
     var xData = dataSet.map( function(d){ return d.x; });
     var yData = dataSet.map( function(d){ return d.y; });

    // Prepare the scales:
     var xScale = d3.scale.ordinal()
             .domain(d3.range(xData.length))
             .rangeRoundBands( [margin.left, width - margin.right], .1 );

     var minyData = d3.min(yData);
     var maxyData = d3.max(yData); 

     // Reversed y-scale as the coordinates of y 
     // are reversed on a screen
     var yScale = d3.scale.linear()
              .domain([minyData, maxyData])
              .range([height-margin.top, margin.bottom]);


    // Define the line
    var line = d3.svg.line()
    .x( function(d, i){ return xScale(i); })
    .y( function(d, i){ return yScale(d.y)-margin.bottom; });

    // Adds the svg canvas
    var lineGraph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the valueline path.
    lineGraph.append("path")
    .attr("class", "line")
    .attr("d", line(dataSet));

};
  
/*
    var circles = svg.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")");

    circles.selectAll("circle")
    .data(lineData)
    .enter()
    .append("circle")
    .attr("cx", function(d){ return xLineScale(d.x);})
    .attr("cy", function(d){ return yScale(d.y);})
    .attr("r", 6)
    .attr("fill", "red");
    //.on("mouseover", circleMouseOver)
    //.on("mouseout", circleMouseOut);

    var hiddenCircles = svg.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")");

    hiddenCircles.selectAll("circle")
    .data(lineData)
    .enter()
    .append("circle")
    .attr("cx", function(d){ return xLineScale(d.x);})
    .attr("cy", function(d){ return yScale(d.y);})
    .attr("r", 20)
    .attr("fill", "black")
    .attr("opacity", 0.0)
    .on("mouseover", circleMouseOver)
    .on("mouseout", circleMouseOut);

   
function circleMouseOver(d)
{
   circle = d3.select(this);
   circle.transition()
       .duration(250)
       .attr("fill", "black")
       .attr("opacity", 1)
       .attr("r", 8);
}
   
function circleMouseOut(d)
{
   circle = d3.select(this);
   circle.transition()
       .duration(250)
       .attr("opacity", 0.0)
       .attr("fill", "red")
       .attr("r", 20);
}
*/
