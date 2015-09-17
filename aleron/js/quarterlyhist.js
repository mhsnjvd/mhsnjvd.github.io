// d3 selected svg and data with a specific format
function plotQuarterlyData( svg, quarterlyPlotData)
{
     // Get the h and w:
     var height = svg.attr("height");
     var width  = svg.attr("width");

     // Define the margins:
     var margin = defineMargins(height, width);

     // Define x-data and get y data from data set:
     var xData = ["Q1", "Q2", "Q3", "Q4"];

     var data = [];
     data = data.concat(quarterlyPlotData.incomeBudget);
     data = data.concat(quarterlyPlotData.incomeActual);
     data = data.concat(quarterlyPlotData.incomePrevious);
     data = data.concat(quarterlyPlotData.expenditure);

     var minyData = d3.min(data);
     var maxyData = d3.max(data); 

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

     var histogramPlot = plotQuarterlyHistogram( svg, margin, xData,  quarterlyPlotData.incomeActual, xScale, yScale, hScale);
     var xAxis = plotQuarterlyXAxis(svg, margin, xData, xScale );
     var yAxis = plotQuarterlyYAxis(svg, margin, yScale, quarterlyPlotData.unit);
     var linePlot1 = plotQuarterlyLine( svg, margin, xData,  quarterlyPlotData.incomePrevious, xScale, yScale, hScale);
     var circles1 = plotQuarterlyCircles( svg, margin, xData,  quarterlyPlotData.incomePrevious, xScale, yScale);
     var linePlot2 = plotQuarterlyLine( svg, margin, xData,  quarterlyPlotData.expenditure, xScale, yScale);
     var circles2 = plotQuarterlyCircles( svg, margin, xData,  quarterlyPlotData.expenditure, xScale, yScale);
     var linePlot3 = plotQuarterlyLine( svg, margin, xData,  quarterlyPlotData.incomeBudget, xScale, yScale);
     var circles3 = plotQuarterlyCircles( svg, margin, xData,  quarterlyPlotData.incomeBudget, xScale, yScale);
     return;
}

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

// Takes  a d3 selected SVG element and makes a histogram for 
// Quarterly data using data given 
//
function plotQuarterlyHistogram( svg, margin, xData, yData, xScale, yScale, heightScale)
{
     // Draw the rectangles: 
     var bars = svg.selectAll("rect")
    .data(yData)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return yScale(d);})
    .attr("height", function(d) { return heightScale(d); })
    .attr("width", function(d) { return xScale.rangeBand(); })
    .attr("fill", "steelblue");

     // Functions for mouse-over and mouse-out:
     bars.on("mouseover", function(d)
            {
                d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "blue");
                return;
            });

    bars.on("mouseout", function(d)
            {
                d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "steelblue");
                return;
            });
    return bars;
}

function plotQuarterlyXAxis(svg, margin, xData, xScale, xLabel)
{
    height = svg.attr("height");
    width = svg.attr("width");
   // Define the axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(4)
        .tickFormat(function(d, i) { return xData[i]; });

       // Remove X Axis text
    //svg.call(xAxis).selectAll("text").remove();
    
     // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height-margin.bottom) + ")")
    .call(xAxis);


    return xAxis;
}

function plotQuarterlyYAxis(svg, margin, yScale, yLabel)
{
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left").ticks(6);

    // Add the Y Axis
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "start")
    .text(yLabel);

    return yAxis;
}


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

function plotQuarterlyLine( svg, margin, xData, yData, xScale, yScale)
{
     var height = svg.attr("height");
     var width  = svg.attr("width");
    
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

function plotQuarterlyCircles(svg, margin, xData, yData, xScale, yScale)
{

    var height = svg.attr("height");
    var width  = svg.attr("width");

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
