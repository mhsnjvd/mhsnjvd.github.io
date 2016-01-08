//**********************************
// Reading the files
//*********************************/
// Make sure the file is read before reading the second file. This is the ( function() {})(); construct:
(function() {
   d3.csv( dashBoardSettings.dataDir +  dashBoardData.bizDevData.files[0].name, function(d)
   { 
     // Copy the data read into the global variable:
     dashBoardData.bizDevData[dashBoardData.bizDevData.files[0].propertyName]= d;
     // Copy the data locally as well
     var data = d;
     console.log(dashBoardSettings.dataDir +  dashBoardData.bizDevData.files[0].name + " read successfuly");
   }); // end of d3.csv()                                
})();
// *******************************************************
//    Business Development Utility functions
// *****************************************************//
function computeQuarterlyBizDevData(bizDevData)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/

    var fileNames = dashBoardData.bizDevData.files.map(function(d) { return d.propertyName; } );
    var contractDataArray = bizDevData[fileNames[0]];
    var pipeLineDataArray = bizDevData[fileNames[1]];
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

    // At the moment we only have two quarter
    var numOfQuarters = 2;

    for ( var i = 0; i < numOfQuarters; i++ )
    {
        // Divide the data based on their statuses:
        var statusProperty = "Status"; 
        var successfulData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.successful; } );
        var unsuccessfulData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.unsuccessful; } );
        var inProgressData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.inProgress; } );
        var qualifiedOutData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.qualifiedOut; } );

        // Record each status and Convert to £k
        var valueProperty = "Value (annualised)";
        data.pipeLineQualifiedOut[i] = (sumArrayProperty( qualifiedOutData, valueProperty) / 1000.0) || 0.0;
        // TODO: How is this different from the above?
        data.pipeLineQualified[i] = (sumArrayProperty( qualifiedOutData, valueProperty)/1000.0) || 0.0;
        data.pipeLineSuccessful[i] = (sumArrayProperty( successfulData, valueProperty)/1000.0) || 0.0;
        data.pipeLineUnsuccessful[i] = (sumArrayProperty( unsuccessfulData, valueProperty)/1000.0) || 0.0;
        data.pipeLineInProgress[i] = (sumArrayProperty( inProgressData, valueProperty)/1000.0) || 0.0;

        /**********************************************/
        var valueTotalProperty = "Value (total)";
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

     return data;
}

function makeBizDevTableData(data)
{
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


function plotBizDevVisualisation(data, subLevelData, subAreaProperty, subLevelList,  areaProperty, area )
{
    // **************** First plot ********************
    var svg = d3.select(document.getElementById("SVG01"));
    plotQuarterlyBizDevData(svg, data);


    // Update data table:
    var tableData = makeBizDevTableData(data);
    updateBizDevTable( document.getElementById("dataTable"), tableData);

    // *********************** Second Plot ****************////
    var height = svg.attr("height");
    var width = svg.attr("width");

    var propertyName = ["pipeLineUnsuccessful", "pipeLineInProgress", "pipeLineSuccessful", "pipeLineQualifiedOut"];

    svg = d3.select(document.getElementById("SVG02"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    var stackSettings = {};
    stackSettings.color = dashBoardSettings.ragColors;
    plotStack(svg, subLevelData, propertyName, subLevelList, stackSettings, areaProperty, area, subAreaProperty);
    addTitle(svg, "Next Level Breakdown"); 

    return;
}


function plotStack(svg, data, layerNames, nameList, stackSettings, areaProperty, area, subAreaProperty)
{
    // The mother object:
    var stack = {};

    var width = +svg.attr("width");
    var height = +svg.attr("height");
    var margin = defineMargins(height, width);
    // More space on the left for long names
    margin.left = 2*margin.left;
    stackSettings.margin = stackSettings.margin || margin;

    plotVerticalGrid(svg, margin, 10);

    var layeredData = [];

    for ( var i = 0; i < layerNames.length; i++ )
    {
        layeredData[i] = [];
        for ( var j = 0; j < data.length; j++ )
        {
            var thisArray = data[j][layerNames[i]];
            var latestQuarterIndex = 1; // for quarter 2
            layeredData[i][j] = {label: nameList[j], y:thisArray[latestQuarterIndex] };
        }
    }

    stack.stackPlot = new stackObjectConstructor(svg, layeredData, stackSettings);
    stack.stackPlot.stackLayer.on("click", stackClick);

    var fileName = dashBoardData.bizDevData.files[1].propertyName;

    function stackClick(d)
    {
        var label = stack.stackPlot.stackLayer.clickedData.data.label;
        var color = stack.stackPlot.stackLayer.clickedData.object.style("fill");
        var subData = dashBoardData.bizDevData[fileName].filter( function(d) { return d[subAreaProperty] == label; }); 
        var property = "Status"
        var propertyValue = dashBoardData.bizDevData.bizDevColorToBizDevProperty( color );
        subData = subData.filter(function(d) { return d[property] == propertyValue; } );
        console.log(subData.length);
        openTablePage(subData);
        return;
    }
    
}

function openTablePage(tableData)
{
    dashBoardData.bizDevData.selectedData = tableData;
    var tablePageWindow = window.open("./table.html");
    tablePageWindow.selecteData = tableData;
}

/*
function plotBizDevVisualisation(data, subLevelData, subLevelList, subAreaProperty, areaProperty, area )
{
    var svg = d3.select(document.getElementById("SVG01"));
    plotQuarterlyBizDevData(svg, data);
    
    //plotQuarterlyBizDevData( svg, data);

    var count = getIdentifierCount( dashBoardData.bizDevData.currentRegionData, dashBoardData.bizDevData.localityList, "Locality");
    var pieData = [];
    for ( var i = 0; i < dashBoardData.bizDevData.localityList.length; i++ )
    {
        pieData.push( {label: dashBoardData.bizDevData.localityList[i], count: count[i]});
    }
    
    svg = d3.select(document.getElementById("SVG02"));
    svg.selectAll("*").remove();
    plotPieChart( svg, pieData);

    // Update data table:
    var tableData = makeBizDevTableData(data);
    updateBizDevTable( document.getElementById("dataTable"), tableData);
    return;
}
*/

function plotQuarterlyBizDevData(svg, data)
{
      svg.selectAll("*").remove();
      svg.style("background-color", "white"); 
      var height = +svg.attr("height");
      var width = +svg.attr("width");

      var margin = defineMargins(height, width);
      
      var xData =  data.quarterNames;
      // Transposed data, have to be transposed for quarterly plotting:
      var yTransposedData = [data.pipeLineQualifiedOut, data.pipeLineInProgress, data.pipeLineSuccessful, data.pipeLineUnsuccessful];
      // only the initial entries correspond to the quarters
      yTransposedData = yTransposedData.map( function(d) { return d.slice(0, data.quarterNames.length); } );
      
      var yData = data.quarterNames.map( function(d) { return []; } );
      for ( var i = 0; i < data.quarterNames.length; i++ )
      {
          for ( var j = 0; j < yTransposedData.length; j++ )
          {
             yData[i][j] = yTransposedData[j][i];
          }
      }

      // Sum of local Arrays
      var sumYData = yData.map(function(d) { return d3.sum(d); } );
      // Global maximum
      var maxYData = d3.max(sumYData);

      // How much cushion do we want?
      maxYData = 1.5*maxYData;
      var minYData = 0.0;

       // x scale and width gap:
      var xScale = d3.scale.ordinal()
             .domain(d3.range(xData.length))
             .rangeRoundBands( [margin.left, width - margin.right], .6 );

      var yScale = d3.scale.linear()
                   .domain([minYData, maxYData])
                   .range([height-margin.top,  margin.bottom]);
      var hScale = d3.scale.linear()
                   .domain([minYData, maxYData])
                   .range([0, height-margin.top - margin.bottom]); 


      plotHorisontalGrid( svg, margin, 10);
      var color = dashBoardSettings.color;
      var histColors = [color.pipeLineQualifiedOut, color.pipeLineInProgress, color.successful, color.unsuccessful];
      var bars = plotMultiHistogram( svg, margin, xData, yData, xScale, yScale, hScale, histColors);          

      plotXAxis(svg, margin, xData, xScale );
      plotXLabel(svg, margin, "Quarterly Contracts and Opportunities");
      plotYAxis(svg, margin, yScale);
      plotYLabel(svg, margin, "£K");         

      // Legend:
      var legendRectSize = 18;
      var legendSpacing = 4;     

      // TODO: these should be read from the dashboard settings file:
      var labels = [ 
                     {label:"Unsuccessful" , color: color.unsuccessful},
                     {label:"Successful" , color: color.successful},
                     {label:"In Progress" , color: color.pipeLineInProgress},
                     {label:"Qualified Out" , color: color.pipeLineQualifiedOut}
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
