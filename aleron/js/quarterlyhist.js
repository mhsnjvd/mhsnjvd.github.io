// Get the y-scale:
// domain: A 2 element array;
// range : A 2 element array;
function quarterlyYScale( domain, range )
{
     var yScale = d3.scale.linear()
              .domain(domain)
              .range(range);
     return yScale;
}

// xScale
// domain is always [0, 1, 2, 3] as there are four quarters:
// range is a 2 element array;
// widthGap is the gap % you want for bars
function quarterlyXScale( range, widthGap )
{
     var xScale = d3.scale.ordinal()
             .domain(d3.range(4))
             .rangeRoundBands( range, widthGap);
     return xScale;
}

// Function to set margins
// height and width of the svg image are passed:
function defineMargins(height, width)
{
     var topMargin = height/8;
     var rightMargin = width/20;
     var bottomMargin = height/8;
     var leftMargin = width/10;
     var margin = {top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin};
     return margin;
}

// Takes  an SVG element and makes a histogram for 
// Quarterly data using data given in dataSet. 
// The dataSet is an object with the following
// fields:
//    data: array of length 4, data for each quarter, positive numbers
//    unit: which is a string representing unit
//    cumulative: either true or false
//    currentTime: can be Q1 to Q4, i.e. the quarter up till and
//    including which the values are actual, the remaining 
//    are forecasts

function plotQuarterlyHistogram(svgID, dataSet)
{
     // Select the SVG object:
     var svg = d3.select(svgID);
     var height = svg.attr("height");
     var width  = svg.attr("width");

     // Define the margins:
     var margin = defineMargins(height, width);

     // Define x-data and get y data from data set:
     var xData = ["Q1", "Q2", "Q3", "Q4"];
     var yData = dataSet.data;
     var unit  = dataSet.unit;
     var cumulative = dataSet.cumulative;


     var minyData = d3.min(yData);
     var maxyData = d3.max(yData); 

     // Add some cushion for the data to look nice:
     minyData = minyData - 0.5*(maxyData - minyData);
     if ( minyData <= 0 )
     {
         minyData = 0;

     }

     // x scale and width gap:
     var xScale = quarterlyXScale([margin.left, width - margin.right], .6);
     // y scale
     var yScale = quarterlyYScale([minyData, maxyData], [height-margin.top, margin.bottom]);
     // h scale
     var hScale = quarterlyYScale([minyData, maxyData], [0, height-margin.top -  margin.bottom]);
     
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
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(4)
        .tickFormat(function(d, i) { return xData[i]; });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left").ticks(6);

    // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height-margin.bottom) + ")")
    .call(xAxis);

    // Remove X Axis text
    //svg.call(xAxis).selectAll("text").remove();

    // Add the Y Axis
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);
    
    return bars;
}// End of function plotQuarterlyHistogram()


// Takes  an SVG element and makes a quarterly line
// plot from data given in dataSet. 
// The dataSet is an object with the following
// fields:
//    data: array of length 4, data for each quarter, positive numbers
//    unit: which is a string representing unit
//    cumulative: either true or false
//    currentTime: can be Q1 to Q4, i.e. the quarter up till and
//    including which the values are actual, the remaining 
//    are forecasts

function plotQuarterlyLine(svgID, dataSet)
{
     var svg = d3.select(svgID);
     var height = svg.attr("height");
     var width  = svg.attr("width");
     var margin = defineMargins(height, width);

     // x and y data from data set:
     var xData = ["Q1", "Q2", "Q3", "Q4"];
     var yData = dataSet.data;
     var unit  = dataSet.unit;
     var cumulative = dataSet.cumulative;

     var minyData = d3.min(yData);
     var maxyData = d3.max(yData); 

     // Add some cushion for the data to look nice:
     minyData = minyData - 0.5*(maxyData - minyData);
     if ( minyData <= 0 )
     {
         minyData = 0;
     }
     
     // x scale and width gap:
     var xScale = quarterlyXScale([margin.left, width - margin.right], 0.6);
     // y scale
     var yScale = quarterlyYScale([minyData, maxyData], [height-margin.top, margin.bottom]);

    // Define the line
    var line = d3.svg.line()
    .x( function(d, i){ return xScale(i) + xScale.rangeBand()/2; })
    .y( function(d, i){ return yScale(d)-margin.bottom; });

    // Adds the svg canvas
    var lineGraph = svg.append("g")
    .attr("transform", "translate(" + 0 + "," + margin.top + ")");

    // Add the valueline path.
    lineGraph.append("path")
    .attr("class", "line")
    .attr("d", line(yData));

    return lineGraph;
} // End of function plotQuarterlyLine

function plotQuarterlyCircles(svgID, dataSet)
{
     var svg = d3.select(svgID);
     var height = svg.attr("height");
     var width  = svg.attr("width");
     var margin = defineMargins(height, width);

     // x and y data from data set:
     var xData = ["Q1", "Q2", "Q3", "Q4"];
     var yData = dataSet.data;
     var unit  = dataSet.unit;
     var cumulative = dataSet.cumulative;

     var minyData = d3.min(yData);
     var maxyData = d3.max(yData); 

     // Add some cushion for the data to look nice:
     minyData = minyData - 0.5*(maxyData - minyData);
     if ( minyData <= 0 )
     {
         minyData = 0;
     }
     
     // x scale and width gap:
     var xScale = quarterlyXScale([margin.left, width - margin.right], 0.6);
     // y scale
     var yScale = quarterlyYScale([minyData, maxyData], [height-margin.top, margin.bottom]);

    var circles = svg.append("g")
    .attr("transform", "translate("+ 0 +","+margin.top+")");

    var normalRadius = 5;

    circles.selectAll("circle")
    .data(yData)
    .enter()
    .append("circle")
    .attr("cx", function(d, i){ return xScale(i) + xScale.rangeBand()/2;})
    .attr("cy", function(d, i){ return yScale(d) - margin.bottom;})
    .attr("r", normalRadius)
    .attr("fill", "red")
    .on("mouseover", circleMouseOver)
    .on("mouseout", circleMouseOut);
    
    return circles;
}

function circleMouseOver(d)
{
   var mouseOnRadius = 9;
   circle = d3.select(this);
   circle.transition()
       .duration(250)
       .attr("r", mouseOnRadius)
       .attr("fill", "orange")
       .attr("opacity", 1)
}
   
function circleMouseOut(d)
{
   var mouseOutRadius = 5;
   circle = d3.select(this);
   circle.transition()
       .duration(250)
       .attr("opacity", 1.0)
       .attr("fill", "red")
       .attr("r", mouseOutRadius);
}
