// Function to set margins
// height and width of the svg image are passed:
function defineMargins(height, width)
{
     var topMargin = height/8;
     var rightMargin = width/20;
     var bottomMargin = height/8;
     var leftMargin = width/7;
     var margin = {top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin};
     return margin;
}

function getHistScalesMargins( svg, data)
{
    var output = {};
    // Define the margins:
    var height = svg.attr("height");
    var width = svg.attr("width");
    var margin = defineMargins(height, width);

    var minyData = d3.min(data);
    var maxyData = d3.max(data); 

    // Add some cushion for the data to look nice:
    minyData = minyData - 0.5*(maxyData - minyData);
    if ( minyData <= 0 )
    {
        minyData = 0;
    }

    // x scale and width gap:
    output.xScale = d3.scale.ordinal()
             .domain(d3.range(4))
             .rangeRoundBands( [margin.left, width - margin.right], .6 );
  
    // y scale
    output.yScale = d3.scale.linear()
              .domain([minyData, maxyData])
              .range([height-margin.top, margin.bottom]);
    // h scale
    output.hScale =  d3.scale.linear()
              .domain([minyData, maxyData])
              .range([0, height-margin.top -  margin.bottom]);

    //margin
    output.margin = margin;

    return output;
}

// Takes  a d3 selected SVG element and makes a histogram
function plotHistogram( svg, margin, xData, yData, xScale, yScale, heightScale)
{
     // Object to be returned which will have an update function
     histogram = {};
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
    /*
    hisogram.update = function()
    {
        return 0;

    }
    */
    return bars;
}

function plotXAxis(svg, margin, xData, xScale, xLabel)
{
    height = svg.attr("height");
    width = svg.attr("width");
   // Define the axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(4)
        .tickFormat(function(d, i) { return xData[i]; });
       
     // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height-margin.bottom) + ")")
    .call(xAxis);

    return xAxis;
}

function plotYAxis(svg, margin, yScale, yLabel)
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


// Takes  an SVG element and draws a line
function plotLine( svg, margin, xData, yData, xScale, yScale, lineColor)
{     
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
    .attr("d", line(yData))
    .attr("stroke", lineColor)
    .attr("stroke-width", 2)
    .attr("fill", "none");

    return lineGraph;
} // End of function plotQuarterlyLine

function plotCircles(svg, margin, xData, yData, xScale, yScale)
{
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
    .attr("fill", "black")
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
       .attr("fill", "black")
       .attr("opacity", 1)
}
   
function circleMouseOut(d)
{
   var mouseOutRadius = 5;
   circle = d3.select(this);
   circle.transition()
       .duration(250)
       .attr("opacity", 1.0)
       .attr("fill", "black")
       .attr("r", mouseOutRadius);
}


// function to handle pieChart.
function plotPieChart(svg, pieData)
{
        var pieChart = {};

        var width = svg.attr("width");
        var hieght = svg.attr("height");

        var pieDim ={w: width, h: height};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2.5;
                
        // create svg for pie chart.
        var pieSVG = svg.append("g")
                       .attr("transform", "translate("+pieDim.w/1.4+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var outerRad = pieDim.r - 10;
        var innerRad = outerRad/2;
        var arc = d3.svg.arc()
            .outerRadius(outerRad)
            .innerRadius(innerRad);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.count; });
        var color = d3.scale.category20b();
        

        // Design the tooltip
        var tooltip = svg.append('div')                                                
          .attr('class', 'tooltip');                                    
                      
        tooltip.append('div')                                           
          .attr('class', 'label');                                      
             
        tooltip.append('div')                                           
          .attr('class', 'count');                                      
        tooltip.append('div')                                           
          .attr('class', 'percent');                                    


        // Draw the pie slices.
        pieSVG.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        //.each(function(d) { this._current = d; })
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .style("fill", function(d, i) { return color(d.data.label); });
        //.on("mouseover",mouseover).on("mouseout",mouseout);

        // Legend:
        var legendRectSize = 18;
        var legendSpacing = 4;     


        var legend = svg.selectAll('.legend')                     
          .data(color.domain())                                   
          .enter()                                                
          .append('g')                                            
          .attr('class', 'legend')                                
          .attr('transform', function(d, i) {                     
            var legendHeight = legendRectSize + legendSpacing;          
            var offset =  legendHeight * color.domain().length / 2;     
            var horz = 2 * legendRectSize;                       
            var vert = i * legendHeight - offset + height/2;                       
            return 'translate(' + horz + ',' + vert + ')';        
          });                                                     

        legend.append('rect')                                     
          .attr('width', legendRectSize)                          
          .attr('height', legendRectSize)                         
          .style('fill', color)                                   
          .style('stroke', color);                                
          
        legend.append('text')                                     
          .attr('x', legendRectSize + legendSpacing)              
          .attr('y', legendRectSize - legendSpacing)              
          .text(function(d) { return d; });                       



        pieSVG.on('mouseover', function(d) {                            
            var total = d3.sum( pieData.map(function(d) { return d.count;})  );                                                        
            var percent = Math.round(1000 * d.data.count / total) / 10; 
            tooltip.select('.label').html(d.data.label);                
            tooltip.select('.count').html(d.data.count);                
            tooltip.select('.percent').html(percent + '%');             
            tooltip.style('display', 'block');                          
          });                                                           
          
          pieSVG.on('mouseout', function(){ tooltip.style('display', 'none');});                                                           


        /*
        // create function to update pie-chart. This will be used by histogram.
        pieChart.update = function(newData)
        {
            piesvg.selectAll("path")
            .data(pie(newData))
            .transition().duration(500)
            .attrTween("d", arcTween);
        }        
        */


        /*
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){ 
                return [v.State,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.State,v.total];}), barColor);
        }


        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) 
        {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        */
}


function plotQuarterlyData( svg, data)
{
      var plotData = data.income;
      plotData = plotData.concat(data.budget);
      plotData = plotData.concat(data.actual);
      plotData = plotData.concat(data.previous);

      var scalesMargins = getHistScalesMargins(svg, plotData);
      var margin = scalesMargins.margin;
      var xScale = scalesMargins.xScale;
      var yScale = scalesMargins.yScale;
      var hScale = scalesMargins.hScale;

      var xData = ["Q1", "Q2", "Q3", "Q4"];

      plotHistogram( svg, margin, xData,  data.budget, xScale, yScale, hScale);          
      plotXAxis(svg, margin, xData, xScale );
      plotYAxis(svg, margin, yScale, "Million £");         


      plotLine( svg, margin, xData, data.previous, xScale, yScale, "green");
      plotCircles( svg, margin, xData, data.previous, xScale, yScale);
      
      plotLine( svg, margin, xData, data.income, xScale, yScale, "orange");
      plotCircles( svg, margin, xData, data.income, xScale, yScale);
      
      plotLine( svg, margin, xData, data.actual, xScale, yScale, "red");
      plotCircles( svg, margin, xData, data.actual, xScale, yScale);
}

