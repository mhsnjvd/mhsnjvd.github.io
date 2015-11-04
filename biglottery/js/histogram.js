function histogram(id, dataSet)
{
     var height = 400;
     var width  = 800;
     var padding = 10;
     var topMargin = 20;
     var rightMargin = 30;
     var bottomMargin = 40;
     var leftMargin = 20;

     var margin = {top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin};
     var svg = d3.select(id).append("svg");
     svg.attr("height", height).attr("width", width);
     svg.style("background-color", "whitesmoke");


     targetData = dataSet.map(function(d){ return d.target; });
     actualData = dataSet.map(function(d){ return d.actual; });
     foreCastData = dataSet.map(function(d){ return d.foreCast; });

     var allData = [];
     allData = allData.concat(targetData, actualData, foreCastData);

     var minData = d3.min(allData);
     var maxData = d3.max(allData);
     
     var xScale = d3.scale.ordinal()
             .domain(d3.range(dataSet.length))
             .rangeRoundBands( [margin.left, width - margin.right], .4 );
     var yScale = d3.scale.linear()
              .domain([minData, maxData])
              .range([height-margin.bottom, 0]);
     var hScale = d3.scale.linear()
              .domain([minData, maxData])
              .range([0, height-margin.top]);

     var bars = svg.selectAll("rect")
    .data(actualData)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return yScale(d);})
    .attr("height", function(d) { return hScale(d); })
    .attr("width", function(d) { return xScale.rangeBand(); })
    .attr("fill", "steelblue")
    .on("mouseover", function(d)
            {
                d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "blue");
                return;
            })
    .on("mouseout", function(d)
            {
                d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "steelblue");
                return;
            });

    // Code to create a line graph:
    //var xLineScale = d3.scale.linear().domain([0, 1, 2, 3]).range([margin.left, width - margin.right]);
    //var yLineScale = d3.scale.linear().domain([minData, maxData]).range([height - margin.bottom, margin.top]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(xScale)
            .orient("bottom").ticks(4);

    var yAxis = d3.svg.axis().scale(yScale)
            .orient("left").ticks(10);

    function xLineScale(x)
    {
        return xScale(x) + xScale.rangeBand()/3;
    }

    // Define the line
    var valueLine = d3.svg.line()
    .x( function(d, i){ 
            var x = d.x;
            // verbose logging to show what's actually being done
            // console.log('Plotting X value for data point: ' + x + ' at: ' + xLineScale(x) + ' using our xScale.');
            return xLineScale(x); })
    .y( function(d, i){ 
            var y = d.y;
            //console.log(y);
            return yScale(y); });

    var lineData = [];
    var N = actualData.length;
    for ( var i = 0; i < N; i++ )
    {
        lineData.push({x: i, y: actualData[i]});
    }

    // Adds the svg canvas
    var lineGraph = svg.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")");

    // Add the X Axis
    lineGraph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height-margin.bottom) + ")")
    .call(xAxis);

    // Add the Y Axis
    lineGraph.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);

    // Add the valueline path.
    lineGraph.append("path")
    .attr("class", "line")
    .attr("d", valueLine(lineData));

  
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

}
   
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
