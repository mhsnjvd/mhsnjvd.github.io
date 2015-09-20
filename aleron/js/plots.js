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
     var height = svg.attr("height");
     var width  = svg.attr("width");

     // Draw the rectangles with 0 height:
     var bars = svg.selectAll("rect")
    .data(yData)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return height - margin.bottom;})
    .attr("height", function(d) { return 0; })
    .attr("width", function(d) { return xScale.rangeBand(); })
    .attr("fill", "steelblue");


    // Draw the gird lines with 0 length:
    var grid = d3.range(10).map( function(d){ 
      return {'x1': margin.left, 'y1': margin.top, 'x2': margin.left, 'y2':margin.top};
    });

   var spanHeight = (height - margin.top - margin.bottom)/10;
   var grids = svg.append('g')
              .attr("id", 'gridLines')                          
              .selectAll('line')
              .data(grid)
              .enter()
              .append('line')
              .attr({'x1':function(d, i){ return d.x1; },
                     'y1':function(d, i){ return d.y1 + (i)*spanHeight; },
                     'x2':function(d, i){ return d.x2; },
                     'y2':function(d, i){ return d.y2 + (i)*spanHeight; } })
              .style({'stroke':'#adadad','stroke-width':'1px'});


    // animate the gird lines:
    svg.select("#gridLines")
       .selectAll("line")
       .data(grid)
       .transition()
       .duration(1000)
       .attr("x2", function(d) { return width - margin.right;});

    // animate the bars:
    svg.selectAll("rect")
    .data(yData)
    .transition()
    .duration(1000)
    .attr("y", function(d) { return yScale(d);})
    .attr("height", function(d) { return heightScale(d); });
    


     // Define the tooltip:     
     var tip = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function(d) {
                return "Value: <span style='color:red'>" + d + "</span>";
           });


     bars.call(tip);

     // Functions for mouse-over and mouse-out:
     bars.on("mouseover", function(d)
            {
                d3.select(this)                
                .transition()
                .duration(1000)                                    
                .attr("fill", "blue");

                tip.show(numberFormat(d));
                            
                return;
            });

    bars.on("mouseout", function(d)
            {
                d3.select(this)
                .transition()
                .duration(1000)
                .attr("fill", "steelblue");

                tip.hide();

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
    .text(yLabel)
    .call(yAxis);

     svg.append("text")      // text label for the y axis
        .attr("x", margin.left / 2)
        .attr("y", margin.top  / 2 )
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
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
    var circlesSVG = svg.append("g")
    .attr("transform", "translate("+ 0 +","+margin.top+")");

    var normalRadius = 5;

    var circles = circlesSVG.selectAll("circle")
    .data(yData)
    .enter()
    .append("circle")
    .attr("cx", function(d, i){ return xScale(i) + xScale.rangeBand()/2;})
    .attr("cy", function(d, i){ return yScale(d) - margin.bottom;})
    .attr("r", normalRadius)
    .attr("fill", "black");

    var tip = d3.tip()
     .attr('class', 'd3-tip')
     .offset([-10, 0])
     .html(function(d) {
                return "Value: <span style='color:red'>" + d + "</span>";
           });

     circles.call(tip);

     circles.on("mouseover", function(d){
        var mouseOnRadius = 9;
        circle = d3.select(this);
        circle.transition()
       .duration(250)
       .attr("r", mouseOnRadius)
       .attr("fill", "black")
       .attr("opacity", 1);

       tip.show(numberFormat(d));
     });

     circles.on("mouseout", function(d){    
        var mouseOutRadius = 5
        circle = d3.select(this);
        circle.transition()
       .duration(250)
       .attr("opacity", 1.0)
       .attr("fill", "black")
       .attr("r", mouseOutRadius);

       tip.hide();
     });
    
    return circles;
}


// function to handle pieChart.
function plotPieChart(svg, pieData)
{
        var pieChart = {};

        var width = svg.attr("width");
        var hieght = svg.attr("height");

        var pieDim ={w: width, h: height};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2.8;
                
        // create svg for pie chart.
        var pieSVG = svg.append("g")
                       .attr("transform", "translate("+pieDim.w/1.33+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var outerRad = pieDim.r - 10;
        var innerRad = outerRad/2;
        var arc = d3.svg.arc()
            .outerRadius(outerRad)
            .innerRadius(innerRad);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.count; });
        var color = d3.scale.category20b();
        
        // Design text for the tool tip:
        var tip = d3.tip()
         .attr('class', 'd3-tip')
         .offset([-10, 0])
         .html(function(d) {
                var label = d.data.label;
                var count = d.data.count;
                var percent = d.data.percent;                
                var displayText = "<span style='color:red'>" + label + "</span>" + " count: " + count + " (" + numberFormat(percent) + "%)";
                return displayText;
           });        

        // Draw the pie slices.
        var piePath = pieSVG.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        //.each(function(d) { this._current = d; })
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .style("fill", function(d, i) { return color(d.data.label); })
        .on("mouseover", function(d)
        {
             var total = d3.sum( pieData.map(function(d) { return d.count; } ));
             d.data.percent = d.data.count/total * 100;                                                              
             tip.show(d)       
        })
        .on("mouseout", function(d)
        {
            //Remove the tooltip
            d3.select("#tooltip").remove();

            tip.hide();            
        });

        piePath.call(tip);


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
            var horz = legendRectSize;                       
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
      svg.selectAll("*").remove();
      svg.style("background-color", "whitesmoke"); 

      var plotData = data.income;
      plotData = plotData.concat(data.budget);
      plotData = plotData.concat(data.actual);
      plotData = plotData.concat(data.previous);

      var scalesMargins = getHistScalesMargins(svg, plotData);
      var margin = scalesMargins.margin;
      var xScale = scalesMargins.xScale;
      var yScale = scalesMargins.yScale;
      var hScale = scalesMargins.hScale;

      var xData = data.quarterNames;

      plotHistogram( svg, margin, xData,  data.budget, xScale, yScale, hScale);          
      plotXAxis(svg, margin, xData, xScale );
      plotYAxis(svg, margin, yScale, "£ million");         


      plotLine( svg, margin, xData, data.previous, xScale, yScale, "green");
      plotCircles( svg, margin, xData, data.previous, xScale, yScale);
      
      plotLine( svg, margin, xData, data.income, xScale, yScale, "orange");
      plotCircles( svg, margin, xData, data.income, xScale, yScale);
      
      plotLine( svg, margin, xData, data.actual, xScale, yScale, "red");
      plotCircles( svg, margin, xData, data.actual, xScale, yScale);


         // Legend:
      var legendRectSize = 18;
      var legendSpacing = 4;     

      var labels = [ {label:"Budget" , color: "steelblue"},
                     {label:"Previous" , color: "green"},
                     {label:"Income" , color: "orange"},
                     {label:"Actual" , color: "red"} ]; 

      var legend = svg.selectAll('.legend')                     
      .data(labels)                                   
      .enter()                                                
      .append('g')                                            
      .attr('class', 'legend')                                
      .attr('transform', function(d, i) {                     
            var legendHeight = legendRectSize + legendSpacing;                    
            var horz = margin.left + legendRectSize;                       
            var vert = 1.2*margin.top + i * legendHeight;                       
            return 'translate(' + horz + ',' + vert + ')';        
          });                                                     

        legend.append('rect')                                     
          .attr('width', legendRectSize)                          
          .attr('height', legendRectSize)                         
          .style('fill', function(d, i) { return d.color; })                                   
          .style('stroke', function(d, i) { return d.color; });                                
          
          
        legend.append('text')                                     
          .attr('x', legendRectSize + legendSpacing)              
          .attr('y', legendRectSize - legendSpacing)              
          .text(function(d) { return d.label; });              

}

plotHorisontalBars();

function plotHorisontalBars()
{
    var categories= ['','Accessories', 'Audiophile', 'Camera & Photo', 'Cell Phones', 'Computers','eBook Readers','Gadgets','GPS & Navigation','Home Audio','Office Electronics','Portable Audio','Portable Video','Security & Surveillance','Service','Television & Video','Car & Vehicle'];

    var dollars = [213,209,190,179,156,209,190,179,213,209,190,179,156,209,190,190];

    var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

    var grid = d3.range(25).map(function(i){
      return {'x1':0,'y1':0,'x2':0,'y2':200};
    });

    var tickVals = grid.map(function(d,i){
      if(i>0){ return i*10; }
      else if(i===0){ return "100";}
    });

    var xscale = d3.scale.linear()
            .domain([10,250])
            .range([0,400]);

    var yscale = d3.scale.linear()
            .domain([0,categories.length])
            .range([0,200]);

    var colorScale = d3.scale.quantize()
            .domain([0,categories.length])
            .range(colors);

    var canvas = d3.select('#chart')
            .append('svg')
            .attr({'width':400,'height':200});

    var grids = canvas.append('g')
              .attr('id','grid')
              .attr('transform','translate(150,10)')
              .selectAll('line')
              .data(grid)
              .enter()
              .append('line')
              .attr({'x1':function(d,i){ return i*30; },
                 'y1':function(d){ return d.y1; },
                 'x2':function(d,i){ return i*20; },
                 'y2':function(d){ return d.y2; },
              })
              .style({'stroke':'#adadad','stroke-width':'1px'});

    var xAxis = d3.svg.axis();
      xAxis
        .orient('bottom')
        .scale(xscale)
        .tickValues(tickVals);

    var yAxis = d3.svg.axis();
      yAxis
        .orient('left')
        .scale(yscale)
        .tickSize(2)
        .tickFormat(function(d,i){ return categories[i]; })
        .tickValues(d3.range(17));

    var y_xis = canvas.append('g')
              .attr("transform", "translate(150,0)")
              .attr('id','yaxis')
              .call(yAxis);

    var x_xis = canvas.append('g')
              .attr("transform", "translate(150,480)")
              .attr('id','xaxis')
              .call(xAxis);

    var chart = canvas.append('g')
              .attr("transform", "translate(150,0)")
              .attr('id','bars')
              .selectAll('rect')
              .data(dollars)
              .enter()
              .append('rect')
              .attr('height',19)
              .attr({'x':0,'y':function(d,i){ return yscale(i)+19; }})
              .style('fill',function(d,i){ return colorScale(i); })
              .attr('width',function(d){ return 0; });


    var transit = d3.select("svg").selectAll("rect")
                .data(dollars)
                .transition()
                .duration(1000) 
                .attr("width", function(d) {return xscale(d); });

    var transitext = d3.select('#bars')
              .selectAll('text')
              .data(dollars)
              .enter()
              .append('text')
              .attr({'x':function(d) {return xscale(d)-200; },'y':function(d,i){ return yscale(i)+35; }})
              .text(function(d){ return d+"$"; }).style({'fill':'#fff','font-size':'14px'});

}