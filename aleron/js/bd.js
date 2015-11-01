// *******************************************************
//    Business Development Utility functions
// *****************************************************//
function computeQuarterlyBizDevData(pipeLineDataArray, contractDataArray)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/

    // This is the object returned:
    var data = {};

    // All the fields we need to compute
    // The array sizes are 5 for the 4 quarters and the FY15/16
    data.pipeLineQualified = [0, 0, 0, 0, 0];
    data.pipeLineQualifiedOut = [0, 0, 0, 0, 0];
    data.pipeLineSuccessful = [0, 0, 0, 0, 0];
    data.pipeLineUnsuccessful = [0, 0, 0, 0, 0];
    data.pipeLineInProgress = [0, 0, 0, 0, 0];
    data.contractAwardPerQuarter = [0, 0, 0, 0, 0];
    data.pipeLineTotal = [0, 0, 0, 0, 0];
    data.pipeLineTotalQualified = [0, 0, 0, 0, 0];
    data.percentAgeQualified = [0, 0, 0, 0, 0];
    data.percentAgeSuccessful = [0, 0, 0, 0, 0];
    data.contractAwardPerQuarter = [0, 0, 0, 0, 0];


    data.quarterNames = ["Q1", "Q2", "Q3", "Q4"];
    data.statusStrings = {successful: "successful", unsuccessful: "unsuccessful", inProgress:"in progress", qualifiedOut: "qulified out"};

    // At the moment we only have one quarter
    var numOfQuarters = 4;

    for ( var i = 0; i < numOfQuarters; i++ )
    {
        // Divide the data based on their statuses:
        var statusProperty = dashBoardData.bizDevData.propertyList[14]; 
        var successfulData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.successful; } );
        var unsuccessfulData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.unsuccessful; } );
        var inProgressData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.inProgress; } );
        var qualifiedOutData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.qualifiedOut; } );

        // Record each status and Convert to £k
        var valueProperty = dashBoardData.bizDevData.propertyList[3];
        data.pipeLineQualifiedOut[i] = (sumArrayProperty( qualifiedOutData, valueProperty) / 1000.0) || 0.0;
        // TODO: How is this different from the above?
        data.pipeLineQualified[i] = (sumArrayProperty( qualifiedOutData, valueProperty)/1000.0) || 0.0;
        data.pipeLineSuccessful[i] = (sumArrayProperty( successfulData, valueProperty)/1000.0) || 0.0;
        data.pipeLineUnsuccessful[i] = (sumArrayProperty( unsuccessfulData, valueProperty)/1000.0) || 0.0;
        data.pipeLineInProgress[i] = (sumArrayProperty( inProgressData, valueProperty)/1000.0) || 0.0;

        /**********************************************/
        var valueTotalProperty = dashBoardData.bizDevData.contractsPropertyList[2];
        data.contractAwardPerQuarter[i] = sumArrayProperty( contractDataArray, valueTotalProperty)/1000.0 || 0.0;

    }


    // Based on the above computations, calculate other things:
    for ( var i = 0; i < numOfQuarters; i++ )
    {
        data.pipeLineTotalQualified[i]= data.pipeLineQualified[i] +  data.pipeLineQualifiedOut[i];
        data.pipeLineTotal[i] = data.pipeLineSuccessful[i] + data.pipeLineUnsuccessful[i] + data.pipeLineInProgress[i];

        data.percentAgeQualified[i] = (data.pipeLineQualified[i] / data.pipeLineTotalQualified[i] * 100.0) || 0.0;
        data.percentAgeSuccessful[i] = (data.pipeLineSuccessful[i] / data.pipeLineTotal[i] * 100.0) || 0.0;
    }


    // Format numbers accordingly:
    for ( var i = 0; i < data.pipeLineQualified.length; i++ )
    {
        data.pipeLineQualified[i] = dashBoardSettings.numberFormat(data.pipeLineQualified[i]); 
        data.pipeLineQualifiedOut[i] = dashBoardSettings.numberFormat(data.pipeLineQualifiedOut[i]);
        data.pipeLineSuccessful[i] = dashBoardSettings.numberFormat(data.pipeLineSuccessful[i] );
        data.pipeLineUnsuccessful[i] = dashBoardSettings.numberFormat(data.pipeLineUnsuccessful[i] );
        data.pipeLineInProgress[i] = dashBoardSettings.numberFormat(data.pipeLineInProgress[i] );
        data.contractAwardPerQuarter[i] = dashBoardSettings.numberFormat(data.contractAwardPerQuarter[i] );
        data.pipeLineTotal[i] = dashBoardSettings.numberFormat(data.pipeLineTotal[i] );
        data.pipeLineTotalQualified[i] = dashBoardSettings.numberFormat(data.pipeLineTotalQualified[i] );
        data.percentAgeQualified[i] = dashBoardSettings.numberFormat(data.percentAgeQualified[i] );
        data.percentAgeSuccessful[i] = dashBoardSettings.numberFormat(data.percentAgeSuccessful[i] );
        data.contractAwardPerQuarter[i] = dashBoardSettings.numberFormat(data.contractAwardPerQuarter[i] );
    }
    return data;
}

function makeBizDevTableData(data)
{
    var tableHeader = ["Pipeline (£K)", "Q1", "Q2", "Q3", "Q4", "FY"];
    var tableData = [];
    tableData.push(tableHeader);
    
    tableData.push( ["Pipeline - Qualified"].concat(data.pipeLineQualified) );
    tableData.push( ["Pipeline - Qualified Out"].concat(data.pipeLineQualifiedOut) );
    tableData.push( ["Total Qualified"].concat(data.pipeLineTotalQualified) );
    tableData.push( ["% Qualified"].concat(data.percentAgeQualified ) );
    
    // Insert empty line in table
    tableData.push( tableHeader.map(function(d) { return "";} ) );
    
    tableData.push( ["Pipeline - Successful"].concat(data.pipeLineSuccessful ) );
    tableData.push( ["Pipeline - Unsuccessful"].concat(data.pipeLineUnsuccessful ) );
    tableData.push( ["Pipeline - In Progress"].concat( data.pipeLineInProgress ) );
    tableData.push( ["Total Pipeline"].concat(data.pipeLineTotal ) );
    tableData.push( ["% Successful"].concat( data.percentAgeSuccessful ) );

    // Insert empty line in table
    tableData.push( tableHeader.map(function(d) { return "";} ) );
    
    tableData.push( ["Contract Awrad per Quarter"].concat( data.contractAwardPerQuarter ) ); 

    return tableData;
}


// table is the ID of the html table element
// tableData is an array, each element of which 
// is another array containing row data
// the first row is conisdered as the table head.
function updateBizDevTable( table, tableData)
{
    while ( table.rows.length > 0 )
    {
        table.deleteRow(0);
    }

    // Number of rows
    var M = tableData.length;
    // Number of columns
    var N = tableData[0].length;


    // Make All the rows
    for ( var i = 0; i < M; i++ )
    {    
        var row;
        row = table.insertRow(i);
        for ( var j = 0; j < N; j++ )
        {
            var cell = row.insertCell(j);   
            cell.innerHTML = tableData[i][j];
        }
    }

    // Which rows do you want to make bold?
    var headerIndices = [0, 3, 4, 9, 10, M-1];
    for ( var i = 0; i < headerIndices.length; i++ )
    {
        for ( var j = 0; j < N; j++ )
        {
            table.rows[headerIndices[i]].cells[j].innerHTML = table.rows[headerIndices[i]].cells[j].innerHTML.bold();      
        }
    }
    return table;    
}


// Takes  a d3 selected SVG element and makes a histogram
// where each bar of the histogram has multiple sub quantities
// xData is an array
// yData is an 2D array with length equal to xData but each element is an array of 
// size equal to the number of sub quantities
// WARNING: yData is assumed to be non-negative
function plotMultiHistogram( svg, margin, xData, yData, xScale, yScale, heightScale, barColorArray)
{
     // Object to be returned which will have an update function
     histogram = {};
     var height = svg.attr("height");
     var width  = svg.attr("width");
     
     if ( yData.length !== xData.length )
     {
         console.log( 'plotMultiHistogram: xData an yData should have same length' );
     }

     if ( yData[0].length !== barColorArray.length )
     {
         console.log( 'plotMultiHistogram: not enough colors specified for each bar.');
     }


     // Append the groups to which bars will be attached:
     for ( var barIndex = 0; barIndex < xData.length; barIndex++ )
     {
         svg.append("g")
         .attr("id", "bars" + barIndex )
         .attr("transform", "translate(" + xScale(barIndex) + ",0)");
     }

     // for each bar:
     for ( var barIndex = 0; barIndex < xData.length; barIndex++ )
     {

         // y-Data for this bar:
         var yBarData = yData[barIndex];

         // Initialize the offsets with 0.0
         var yOffset = yBarData.map(function(d) { return 0.0; } );
         for ( var i = 1; i < yOffset.length; i++ )
         {
             // Scaled Cumulative sum:
             yOffset[i] = yOffset[i-1] + yBarData[i-1];
         }

         // Draw the rectangles with 0 height:
         var bars = svg.select("#bars"+barIndex)
         .selectAll("rect")
         .data(yBarData)
         .enter()
         .append("rect")
         .attr("x", function(d, i) { return 0; }) // fix the x coordinate
         .attr("y", function(d, i) { return yScale(d + yOffset[i]);})
         .attr("height", function(d) { return 0*heightScale(d); })
         .attr("width", function(d) { return xScale.rangeBand(); })
         .attr("fill", function(d, i){ return barColorArray[i];} );

        // animate the bars:
        svg.select("#bars" + barIndex )
        .selectAll("rect")
        .data(yBarData)
        .transition()
        .duration(2000)
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

               tip.show(dashBoardSettings.numberFormat(d));
                           
               return;
           });

        bars.on("mouseout", function(d, i)
           {
               d3.select(this)
               .transition()
               .duration(1000)
               .attr("fill", barColorArray[i]);

               tip.hide();

               return;
           });    
     }

     /*
        bars.update = function(newData)
        {
            svg.selectAll("rect")
            .data(newData)
            .transition()
            .duration(2000)
            .attr("y", function(d) { return yScale(d);})
            .attr("height", function(d) { return heightScale(d); });
        }
        return bars;
     */
}


function plotQuarterlyBizDevData( svg, data)
{
      svg.selectAll("*").remove();
      svg.style("background-color", "whitesmoke"); 
      var height = svg.attr("height");
      var width = svg.attr("width");

      var margin = defineMargins(height, width);

      var xData = ["Q1", "Q2", "Q3", "Q4"];
      var yData = [ [1, 1, 2, 1], [3, 1, 1, 4], [1, 4, 5, 1], [.5, 3, 1, 1] ];

       // x scale and width gap:
      var xScale = d3.scale.ordinal()
             .domain(d3.range(4))
             .rangeRoundBands( [margin.left, width - margin.right], .6 );

      var yScale = d3.scale.linear()
                   .domain([0, 12])
                   .range([height-margin.top,  margin.bottom]);
      var hScale = d3.scale.linear()
                   .domain([0, 12])
                   .range([0, height-margin.top - margin.bottom]); 


      plotHorisontalGrid( svg, margin, 10);
      var histColors = ["orange", "green", "yellow", "red"];
      var bars = plotMultiHistogram( svg, margin, xData, yData, xScale, yScale, hScale, histColors);          

      plotXAxis(svg, margin, xData, xScale );
      plotXLabel(svg, margin, "Quarterly Contracts");
      plotYAxis(svg, margin, yScale);
      plotYLabel(svg, margin, "£K");         

      // Legend:
      var legendRectSize = 18;
      var legendSpacing = 4;     

      var labels = [ 
                     {label:"unsuccessful" , color: "red"},
                     {label:"qualified out" , color: "yellow"},
                     {label:"successful" , color: "green"},
                     {label:"qualified" , color: "orange"} 
                    ]; 

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

        //legend.on("mouseover", function(d) { bars.update( [0, 0, 0, 0] ); return ; } );
}



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

function getVerticalScales(svg, margin, data)
{
     var scales = {};
    // Define the margins:
    var height = svg.attr("height");
    var width = svg.attr("width");    

    var minyData = d3.min(data);
    var maxyData = d3.max(data); 

    // Add some cushion for the data to look nice:
    minyData = minyData - 0.5*(maxyData - minyData);
    if ( minyData <= 0 )
    {
        minyData = 0;
    }

  
    // y scale
    scales.yScale = d3.scale.linear()
              .domain([minyData, maxyData])
              .range([height-margin.top,  margin.bottom]);

    scales.hScale = d3.scale.linear()
                   .domain([minyData, maxyData])
                   .range([0, height-margin.top - margin.bottom]);
    return scales;
}

// Takes  a d3 selected SVG element and makes a histogram
function plotHistogram( svg, margin, xData, yData, xScale, yScale, heightScale, barColor)
{
     // Object to be returned which will have an update function
     histogram = {};
     var height = svg.attr("height");
     var width  = svg.attr("width");
     
     // Switch to default if no color is passed
     barColor = barColor || dashBoardSettings.color.histogram;
     
     if ( typeof(barColor) === "string")
     {
         // Copy the same string n times, for each data entry
         barColor = yData.map( function(d) { return barColor;});
     }
     else
     {
         // Should be an array of colors
         if ( barColor.length !== yData.length)
         {
              console.log( "plotHistogram: number of colors not the same as number of bars.");
         }
     }
     
     // Draw the rectangles with 0 height:
     var bars = svg.selectAll("rect")
    .data(yData)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return height - margin.bottom;})
    .attr("height", function(d) { return 0; })
    .attr("width", function(d) { return xScale.rangeBand(); })
    .attr("fill", function(d, i){ return barColor[i];} );

    // animate the bars:
    svg.selectAll("rect")
    .data(yData)
    .transition()
    .duration(2000)
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

               tip.show(dashBoardSettings.numberFormat(d));
                           
               return;
           });

    bars.on("mouseout", function(d, i)
           {
               d3.select(this)
               .transition()
               .duration(1000)
               .attr("fill", barColor[i]);

               tip.hide();

               return;
           });    

    bars.update = function(newData)
    {
        svg.selectAll("rect")
        .data(newData)
        .transition()
        .duration(2000)
        .attr("y", function(d) { return yScale(d);})
        .attr("height", function(d) { return heightScale(d); });
    }
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

function plotXLabel( svg, margin, xLabel)
{
  var height = svg.attr("height");
  var width = svg.attr("width");

  var label = svg.append("text")
        .attr( "id", "xLabel")
        .attr("x", margin.left + (width - margin.left - margin.right - xLabel.length) / 2)
        .attr("y", height - (margin.top  / 4) )
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(xLabel);  
  return label;  
}

function plotYAxis(svg, margin, yScale, yLabel)
{
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left").ticks(6);

    // Add the Y Axis
    var label = svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .text(yLabel)
    .call(yAxis);  

    return yAxis;
}

function plotYLabel( svg, margin, yLabel)
{
   var label = svg.append("text")
        .attr( "id", "yLabel")
        .attr("x", margin.left / 2 )
        .attr("y", margin.top  / 2 )
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(yLabel);

        return label;
}


// Takes  an SVG element and draws a line
function plotLine( svg, margin, xData, yData, xScale, yScale, lineColor)
{     
    // Define the line
    var dummyLineFunction = d3.svg.line()
    .x( function(d, i){ return xScale(0) + xScale.rangeBand()/2; })
    .y( function(d, i){ return yScale(yData[0])-margin.bottom; });


    var lineFunction = d3.svg.line()
    .x( function(d, i){ return xScale(i) + xScale.rangeBand()/2; })
    .y( function(d, i){ return yScale(d)-margin.bottom; });

    // Adds the svg canvas
    var lineGraph = svg.append("g")
    .attr("transform", "translate(" + 0 + "," + margin.top + ")")
    .attr('id', "lines"+lineColor);

    // Add the valueline path.
    lineGraph.append("path")
    .attr("class", "line")
    .attr("d", dummyLineFunction(yData))
    .attr("stroke", lineColor)
    .attr("stroke-width", 2)
    .attr("fill", "none");

    // Animations:
    svg.select("#lines"+lineColor)
    .selectAll("path")
    .data(yData)
    .transition()
    .duration(2000)
    .attr("d", lineFunction(yData));
    

    return lineGraph;
} // End of function plotQuarterlyLine

function plotHorisontalGrid( svg, margin, nLines)
{
    var height = svg.attr("height");
    var width  = svg.attr("width");


    // Draw the gird lines with 0 length:
    var grid = d3.range(nLines).map( function(d){ 
      return {'x1': margin.left, 'y1': margin.top, 'x2': margin.left, 'y2':margin.top};
    });

   var spanHeight = (height - margin.top - margin.bottom)/nLines;
   var grids = svg.append('g')
              .attr("id", 'horzGridLines')                          
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
    svg.select("#horzGridLines")
       .selectAll("line")
       .data(grid)
       .transition()
       .duration(2000)
       .attr("x2", function(d) { return width - margin.right;});
}

function plotCircles(svg, margin, xData, yData, xScale, yScale, circleColor)
{
    var circlesSVG = svg.append("g")
    .attr("transform", "translate("+ 0 +","+margin.top+")")
    .attr("id", "circles"+circleColor);

    var normalRadius = 5;

    var circles = circlesSVG.selectAll("circle")
    .data(yData)
    .enter()
    .append("circle")
    .attr("cx", function(d, i){ return xScale(0) + xScale.rangeBand()/2;})
    .attr("cy", function(d, i){ return yScale(yData[0]) - margin.bottom;})
    .attr("r", normalRadius)
    .attr("fill", circleColor);


    // Animations:
    svg.select("#circles"+circleColor)
    .selectAll("circle")
    .data(yData)
    .transition()
    .duration(3000)
    .attr("cx", function(d, i){ return xScale(i) + xScale.rangeBand()/2;})
    .attr("cy", function(d, i){ return yScale(d) - margin.bottom;});
    

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

       tip.show(dashBoardSettings.numberFormat(d));
     });

     circles.on("mouseout", function(d){    
        var mouseOutRadius = 5
        circle = d3.select(this);
        circle.transition()
       .duration(250)
       .attr("opacity", 1.0)
       .attr("fill", circleColor)
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
        var height = svg.attr("height");

        var pieDim ={w: width, h: height};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2.8;
                
        // create svg for pie chart.
        var pieSVG = svg.append("g")
                       .attr("transform", "translate("+pieDim.w/1.33+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var outerRad = pieDim.r - 10;
        var innerRad = outerRad/2.2;
        var arc = d3.svg.arc()
            .outerRadius(outerRad/10)
            .innerRadius(innerRad/10);

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
                var displayText = "<span style='color:red'>" + label + "</span>" + " count: " + count + " (" + dashBoardSettings.numberFormat(percent) + "%)";
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
         
        // Animation 
        var newArc = d3.svg.arc()
            .outerRadius(outerRad)
            .innerRadius(innerRad);

        pieSVG.selectAll("path")
        .data(pie(pieData))
        .transition()
        .duration(2000)
        .attr("d", newArc);

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

function plotQuarterlyFinancialData( svg, data)
{
      svg.selectAll("*").remove();
      svg.style("background-color", "whitesmoke"); 
      var height = svg.attr("height");
      var width = svg.attr("width");

      var plotData = data.forecast;
      plotData = plotData.concat(data.budget);
      plotData = plotData.concat(data.actual);
      plotData = plotData.concat(data.previous);
      
      var margin = defineMargins(height, width);

       // x scale and width gap:
      var xScale = d3.scale.ordinal()
             .domain(d3.range(4))
             .rangeRoundBands( [margin.left, width - margin.right], .6 );
      var vScales = getVerticalScales( svg, margin, plotData);
      var yScale = vScales.yScale;
      var hScale = vScales.hScale;      
      var xData = data.quarterNames;

      var color  = dashBoardSettings.color;

      plotHorisontalGrid( svg, margin, 10);
      var mixedData = [];
      mixedData.push(data.actual[0]);
      mixedData = mixedData.concat( data.forecast.slice(1) );
      var histColors = [color.actual, color.forecast, color.forecast, color.forecast];
      var bars = plotHistogram( svg, margin, xData, data.actual, xScale, yScale, hScale, histColors);          
      //plotHistogram( svg, margin, xData, data.forecast, xScale, yScale, hScale);

            
      plotLine( svg, margin, xData, data.budget, xScale, yScale, color.budget);
      plotCircles( svg, margin, xData, data.budget, xScale, yScale, color.budget);

      plotLine( svg, margin, xData, data.previous, xScale, yScale, color.previous);
      plotCircles( svg, margin, xData, data.previous, xScale, yScale, color.previous);
      

      plotXAxis(svg, margin, xData, xScale );
      plotXLabel(svg, margin, "Quarterly Financial Data");
      plotYAxis(svg, margin, yScale);
      plotYLabel(svg, margin, "£ million");         

      // Legend:
      var legendRectSize = 18;
      var legendSpacing = 4;     

      var labels = [ {label:"Actual" , color: color.actual},
                     {label:"Forecast" , color: color.forecast},
                     {label:"Budget" , color: color.budget},
                     {label:"Previous" , color: color.previous}
                    ]; 

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

        //legend.on("mouseover", function(d) { bars.update( [0, 0, 0, 0] ); return ; } );
}

function plotCostCentres(svg, data)
{
      svg.selectAll("*").remove();
      svg.style("background-color", "whitesmoke");
      
      // Second Histogram Plot on the adjacent svg                      
      var height = svg.attr("height");
      var width  = svg.attr("width");

      // Extract Q1 actual and cast it to number:
      var yData = data.map( function(d) { return +d["Q1 Actual"]; });

      // Extract the cost centre number
      var xData = data.map( function(d) { return d["Cost Centres"]; });

      var margin = defineMargins(height, width);
      var vScales = getVerticalScales(svg, margin, yData);          
      var yScale = vScales.yScale;
      var hScale = vScales.hScale;        
      var xScale = d3.scale.ordinal()
                   .domain(d3.range(xData.length))
                   .rangeRoundBands( [margin.left, width - margin.right], .2);
      
      plotVerticalGrid( svg, margin, 25);
      plotHorisontalBars(svg, margin, xData, yData);
      plotXLabel( svg, margin, "Cost Centres within the Locality")
      plotYLabel( svg, margin, "CC ID")
      
}   

function plotVerticalGrid( svg, margin, nLines)
{
    var nLines = 25;
    var height = svg.attr("height");
    var width  = svg.attr("width");

    var grid = d3.range(nLines).map( function(d)
    {
      return {'x1':margin.left,'y1':margin.top,'x2':margin.left,'y2':margin.top};
    });    

    var gridSpacing = (width - margin.left - margin.right )/nLines;

    var grids = svg.append('g')
              .attr("id", 'verticalGridLines')                                      
              .selectAll('line')
              .data(grid)
              .enter()
              .append('line')
              .attr({'x1':function(d, i){ return margin.left + (i+1)*gridSpacing; },
                     'y1':function(d, i){ return margin.top; },
                     'x2':function(d, i){ return margin.left + (i+1)*gridSpacing; },
                     'y2':function(d, i){ return margin.top; } })
              .style({'stroke':'#adadad','stroke-width':'1px'});

     // animate the gird lines:
     svg.select("#verticalGridLines")
       .selectAll("line")
       .data(grid)
       .transition()
       .duration(2000)
       .attr("y2", function(d) { return height - margin.bottom;});        

}   

function plotHorisontalBars(svg, margin, categories, values)
{
    var height = svg.attr("height");
    var width = svg.attr("width");    

    var minVal = 0;
    var maxVal = d3.max(values);

    // used for the height of the horizontal bar and the gaps 
    // in between:
    var yScale = d3.scale.ordinal()
             .domain(d3.range(categories.length))
             .rangeRoundBands( [margin.top, height - margin.bottom], .2 );

    // used for the width of the horizontal bar:
    var xScale = d3.scale.linear()
            .domain([0, maxVal])
            .range([0, width - margin.right - margin.left ]);
      
    var color = d3.scale.category20();
    var chart = svg.append('g')              
              .attr('id','horzBars')
              .selectAll('rect')
              .data(values)
              .enter()
              .append('rect')
              .attr("x", function(d, i) { return margin.left;})
              .attr("y", function(d, i) { return yScale(i);})
              .attr('height', yScale.rangeBand())              
              .attr('width',function(d){ return 0; })
              .style('fill', function(d,i){ return color(d); });

    // animate the horizontal bars:
     svg.select("#horzBars")
       .selectAll("rect")
       .data(values)
       .transition()
       .duration(2000)
       .attr("width", function(d) { 
            if ( d === 0 )
            { 
                d3.select(this).attr("opacity", 0);
                return width - margin.left - margin.right;
            }
            else
            { 
                 return xScale(d);
            }
          });    


       // Design text for the tool tip:
        var tip = d3.tip()
         .attr('class', 'd3-tip')
         .offset([-10, 0])
         .html(function(d, i) {
                var name = categories[i];
                var value = d;                
                var displayText = "<span style='color:red'>CC: " + name + "</span>" + " Q1 Income: " + value;
                return displayText;
           });        

        
        chart.on("mouseover", function(d, i)
        {
            d3.select(this)
            .transition()
            .duration(500)
            .style("color", "blue");

            tip.show(d, i)       
        })
        .on("mouseout", function(d)
        {   
            d3.select(this)
            .transition()
            .duration(500)
            .style("color", color(d));

            tip.hide();            
        });

        chart.call(tip);

        var yAxis = d3.svg.axis();
         yAxis.orient('left')
        .scale(yScale)
        .tickSize(1)        
        .tickFormat(function(d,i){ return categories[i]; })
        .tickValues(d3.range(categories.length));

    var y_xis = svg.append('g')
              .attr("transform", "translate(" + margin.left + ",0)")
              .attr('id','yaxis')
              .call(yAxis)
              .selectAll("text")
              .attr("font-size", "6");
        
}
