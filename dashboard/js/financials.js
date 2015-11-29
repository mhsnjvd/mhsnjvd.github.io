// **************************************************
// Initialisations for financials
// **************************************************
//
// Read all the files needed for financials:

// Read file 0:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.financialsData.files[0].name;
     var propertyName = dashBoardData.financialsData.files[0].propertyName;
     
     dashBoardData.financialsData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.financialsData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.financialsData[propertyName].length );
     }); // end of d3.csv()                                
 })();

// read File 1:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.financialsData.files[1].name;
     var propertyName = dashBoardData.financialsData.files[1].propertyName;
     
     dashBoardData.financialsData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.financialsData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.financialsData[propertyName].length );
     }); // end of d3.csv()                                
 })();

// Read file 2:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.financialsData.files[2].name;
     var propertyName = dashBoardData.financialsData.files[2].propertyName;
     
     dashBoardData.financialsData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.financialsData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.financialsData[propertyName].length );
     }); // end of d3.csv()                                
 })();

// TODO: The following doesn't work, investigate why???????
/*
(function() 
{                                                                                                                               
     var dataFileName = ["010_Finance_201415_FY_CC.csv", "011_a_Finance_201516_P3_CC.csv", "011_b_Finance_201516_P6_CC.csv"];
     var propertyName = [ "FY1415", "P31516", "P61516"];
     console.log("entering grand daddy function");
     
     for( var i = 0; i < 3; i++ )
     {
        var fileName = dashBoardSettings.dataDir +  dataFileName[i];
        d3.csv( fileName, function(d)
        { 
               // Copy the data read into the global variable:
               console.log(fileName);
               dashBoardData.financialsData[propertyName[i]] = d;
               console.log("file " + fileName + " read successfully.");
               console.log( dashBoardData.financialsData[propertyName[i]].length );
        }); // end of d3.csv()                                
     }
     console.log("leaving grand daddy function");
 })();
 */

// ****************************************
//  Financials Utilities
//  *************************************//

// Returns an object with four fields, each is an array of length 4
// one entry for each quarter.

function addFinancialDataFields(data)
{
    data.quarterly = [0, 0, 0, 0];
    data.FY = [];  // Fiscal Year
    data.FYBudget = [];  // Fiscal Year Budget
    data.variation = [];
    data.variationPercentage = [];
    return data;
}

function computeQuarterlyFinancialData(data)
{
    var dataOut = {};

    dataOut.quarterNames = ["Q1", "Q2", "Q3", "Q4"];
    dataOut.numReportedQuarters = 2;

    dataOut.income = {};
    addFinancialDataFields(dataOut.income);

    dataOut.budget = {};
    addFinancialDataFields(dataOut.budget);

    dataOut.expenditure = {};
    addFinancialDataFields(dataOut.expenditure);

    dataOut.vf = {};
    addFinancialDataFields(dataOut.vf);

    dataOut.vfByExp = {};
    addFinancialDataFields(dataOut.vfByExp);

    dataOut.previousYear = {};
    addFinancialDataFields(dataOut.previousYear);


    // Where have we stored files corresponding to each quarter?
    // Refer to globals.js for file list
    var quarterlyFileIndices = [1, 2];
    var files = dashBoardData.financialsData.files;
    var quarterlyData = [];

    // the data is already in £K, so no divisor needed
    var unitDivisor = 1.0;

    // Compute the quarterlies
    for ( var i = 0; i < dataOut.numReportedQuarters; i++ )
    {
        quarterlyData = data[files[quarterlyFileIndices[i]].propertyName];
        // YTD is year to data
        dataOut.income.quarterly[i] = sumArrayProperty(quarterlyData, "Inc-YTD-Act") / unitDivisor;
        dataOut.budget.quarterly[i] = sumArrayProperty(quarterlyData, "Inc-YTD-Bud") / unitDivisor;
        dataOut.expenditure.quarterly[i] = sumArrayProperty(quarterlyData, "Exp-YTD-Act") / unitDivisor;
        dataOut.vf.quarterly[i] = sumArrayProperty(quarterlyData, "VF-YTD-Act") / unitDivisor;
        dataOut.vfByExp.quarterly[i] = (dataOut.vf.quarterly[i] / dataOut.expenditure.quarterly[i] * 100) || 0.0;
    }



    // Compute other quantities
    dataOut.income.FY = sumArrayProperty(data[files[2].propertyName], "Inc-FY-FC") / unitDivisor;
    dataOut.income.FYBudget = sumArrayProperty(data[files[1].propertyName], "Inc-FY-Bud") / unitDivisor;
    dataOut.income.variation = dataOut.income.FY - dataOut.income.FYBudget;
    dataOut.income.variationPercentage = (dataOut.income.variation / dataOut.income.FYBudget * 100) || 0.0;

    dataOut.expenditure.FY = sumArrayProperty(data[files[2].propertyName], "Exp-FY-FC") / unitDivisor;
    dataOut.expenditure.FYBudget = sumArrayProperty(data[files[1].propertyName], "Exp-FY-Bud") / unitDivisor;
    dataOut.expenditure.variation = dataOut.expenditure.FY - dataOut.expenditure.FYBudget;
    dataOut.expenditure.variationPercentage = (dataOut.expenditure.variation / dataOut.expenditure.FYBudget * 100) || 0.0;

    // TODO: What are these two quantities?
    dataOut.budget.FY = sumArrayProperty(data[files[2].propertyName], "Inc-FY-Bud") / unitDivisor;
    dataOut.budget.FYBudget = sumArrayProperty(data[files[2].propertyName], "Inc-FY-Bud") / unitDivisor;
    // Do the following make sense now?
    dataOut.budget.variation = 0.0;
    dataOut.budget.variationPercentage = 0.0;

    dataOut.vf.FY = sumArrayProperty(data[files[2].propertyName], "VF-FY-FC") / unitDivisor;
    dataOut.vf.FYBudget = sumArrayProperty(data[files[1].propertyName], "VF-FY-Bud") / unitDivisor;
    dataOut.vf.variation = dataOut.vf.FY - dataOut.vf.FYBudget;
    dataOut.vf.variationPercentage = (dataOut.vf.variation / dataOut.vf.FYBudget * 100) || 0.0;

    dataOut.vfByExp.FY = (dataOut.vf.FY/dataOut.expenditure.FY * 100) || 0.0
    dataOut.vfByExp.FYBudget = (dataOut.vf.FYBudget/dataOut.expenditure.FYBudget * 100) || 0.0;
    dataOut.vfByExp.variation = dataOut.vfByExp.FY - dataOut.vfByExp.FYBudget;
    // This quantity doesn't make sense?
    dataOut.vfByExp.variationPercentage = 0.0;




    // TODO: Is this already computed somewhere in an excel sheet?
    // Just do linear interpolation:
    
    // Forecast income and expenditure
    var lastInc = dataOut.income.quarterly[dataOut.numReportedQuarters - 1];
    var lastExp = dataOut.expenditure.quarterly[dataOut.numReportedQuarters - 1];
    var lastBudget = dataOut.budget.quarterly[dataOut.numReportedQuarters - 1];
    var incFC   = dataOut.income.FY;
    var expFC   = dataOut.expenditure.FY;

    // What should this quantity be?
    var budgetFC = dataOut.income.FY;

    // How many predictions needed?
    var n = dataOut.quarterNames.length - dataOut.numReportedQuarters;

    var incDelta = (incFC - lastInc)/n;
    var expDelta = (expFC - lastExp)/n; 
    var budgetDelta = (budgetFC - lastBudget)/n;

    for ( var i = dataOut.numReportedQuarters; i < dataOut.quarterNames.length; i++ )
    {
        dataOut.income.quarterly[i] = dataOut.income.quarterly[i-1] + incDelta;
        dataOut.expenditure.quarterly[i] = dataOut.expenditure.quarterly[i-1] + expDelta;
        dataOut.budget.quarterly[i] = dataOut.budget.quarterly[i-1] + budgetDelta;
    }

    //*****************************************
    // TODO: Make expenditure quarterly data positive
    // ******************************************
    dataOut.expenditure.quarterly = dataOut.expenditure.quarterly.map( function (d) { return Math.abs(d); } );


    //*********************************************************************
    //********************************************************************
    //        Previous Year Data
    //********************************************************************
    //*********************************************************************/
    // File for last year
    quarterlyData = data[files[0].propertyName];

    // Compute the quarterly for last year
    dataOut.previousYear.quarterly[0] = sumArrayProperty(quarterlyData, "Q1_Inc_YTD") / unitDivisor;
    dataOut.previousYear.quarterly[1] = sumArrayProperty(quarterlyData, "Q2_Inc_YTD") / unitDivisor;
    dataOut.previousYear.quarterly[2] = sumArrayProperty(quarterlyData, "Q3_Inc_YTD") / unitDivisor;
    dataOut.previousYear.quarterly[3] = sumArrayProperty(quarterlyData, "Q4_Inc_YTD") / unitDivisor;

    // This data is not cumulative, so accumulate it:
    dataOut.previousYear.quarterly = cumsumArray(dataOut.previousYear.quarterly);
    dataOut.previousYear.FY = dataOut.previousYear.quarterly[3]; //This is the same as the final cumulative quarter
    dataOut.previousYear.FYBudget = sumArrayProperty(data[files[0].propertyName], "FY_BUD_Inc") / unitDivisor;
    dataOut.previousYear.variation = dataOut.previousYear.FY - dataOut.previousYear.FYBudget;
    dataOut.previousYear.variationPercentage = (dataOut.previousYear.variation / dataOut.previousYear.FYBudget * 100) || 0.0;

    return dataOut;
}

function makeFinancialTableData(data)
{
    var tableHeader = ["(£k)", "Q1", "Q2", "Q3", "Q4", "FY", "Budget", "Variation", "Variation (%)"];
    var tableData = [];
    tableData.push(tableHeader);

    var firstColumn = ["Income", "Expenditure", "Budget", "VF", "VF % of Exp", "Previous Year"];
    var propertyNames = ["income", "expenditure", "budget", "vf", "vfByExp", "previousYear" ];

    for ( var i = 0; i < firstColumn.length; i++ )
    {
        var row = [];
        row.push( firstColumn[i]);
        // Attach quarterly data:
        row = row.concat( data[propertyNames[i]].quarterly );
        // Push other things:
        row.push( data[propertyNames[i]].FY );
        row.push( data[propertyNames[i]].FYBudget );
        row.push( data[propertyNames[i]].variation );
        row.push( data[propertyNames[i]].variationPercentage );

        // Format this row, leaving the first element which is a string:
        for ( var j = 1; j < row.length; j++ )
        {
            row[j] = (dashBoardSettings.numberFormat(row[j]));
        }
        tableData.push(row);
    }

    return tableData;
}

// table is the ID of the html table element
// tableData is an array, each element of which 
// is another array containing row data
// the first row is conisdered as the table head.
function updateFinancialTable( table, tableData)
{
    while ( table.rows.length > 0 )
    {
        table.deleteRow(0);
    }

    // Number of rows
    var M = tableData.length;
    // Number of columns
    var N = tableData[0].length;

    // Which rows are headers?

    // Make All the rows
    for ( var i = 0; i < M; i++ )
    {    
        var row;
        row = table.insertRow(i);
        for ( var j = 0; j < N; j++ )
        {
            var cell = row.insertCell(j);   
            cell.innerHTML = tableData[i][j];
            // Align all but the first column to the right:
            if ( j !== 0 )
            {
                cell.align = "right";
            }
        }
    }

    // Only the first row is the header row for this table:
    var headerIndices = [0];

    // Make header rows specified by their indices to be bold:
    for ( var i = 0; i < headerIndices.length; i++ )
    {
        // Make table header
        //var header = table.createTHead();
        //var row = header.insertRow(0);
        for ( var j = 0; j < N; j++ )
        {
            table.rows[headerIndices[i]].cells[j].innerHTML = table.rows[headerIndices[i]].cells[j].innerHTML.bold();      
        }
    }
    return table;    
}

// All data is assumed positive
// svg is d3 selected svg
function plotQuarterlyFinancialData( svg, data)
{
      svg.selectAll("*").remove();
      svg.style("background-color", "white"); 
      var height = svg.attr("height");
      var width = svg.attr("width");

      var plotData = data.income.quarterly;
      plotData = plotData.concat(data.expenditure.quarterly);
      plotData = plotData.concat(data.previousYear.quarterly);
      plotData = plotData.concat(data.budget.quarterly);
      
      
      var margin = defineMargins(height, width);

      var xData = data.quarterNames;
       // x scale and width gap:
      var xScale = d3.scale.ordinal()
             .domain(d3.range(xData.length))
             .rangeRoundBands( [margin.left, width - margin.right], .6 );
      var vScales = getVerticalScales( svg, margin, plotData);
      var yScale = vScales.yScale;
      var hScale = vScales.hScale;      


      plotHorisontalGrid( svg, margin, 10);
      
      // Select colors based on fore cast and actual data
      var color  = dashBoardSettings.color;
      var histColors = xData.map(function(d, i) {
          if ( i < data.numReportedQuarters ) 
          {
              return color.income;
          }
          else
          {
              return color.forecast;
          }
      });

      var yData = data.income.quarterly.map( function (d) { return Math.abs(d); } );
      var bars = plotHistogram( svg, margin, xData, yData, xScale, yScale, hScale, histColors);          
      //plotHistogram( svg, margin, xData, data.forecast, xScale, yScale, hScale);

            
      yData = data.budget.quarterly.map( function (d) { return Math.abs(d); } );
      plotLine( svg, margin, xData, yData, xScale, yScale, color.budget);
      plotCircles( svg, margin, xData, yData, xScale, yScale, color.budget);

      yData = data.previousYear.quarterly.map( function (d) { return Math.abs(d); } );
      plotLine( svg, margin, xData, yData, xScale, yScale, color.previousYear);
      plotCircles( svg, margin, xData, yData, xScale, yScale, color.previousYear);
      
      yData = data.expenditure.quarterly.map( function (d) { return Math.abs(d); } );
      plotLine( svg, margin, xData, yData, xScale, yScale, color.expenditure);
      plotCircles( svg, margin, xData, yData, xScale, yScale, color.expenditure);

      plotXAxis(svg, margin, xData, xScale );
      plotXLabel(svg, margin, "Quarterly Financial Data");
      plotYAxis(svg, margin, yScale);
      plotYLabel(svg, margin, "£K");         

      // Legend:
      var legendRectSize = 18;
      var legendSpacing = 4;     

      var labels = [ {label:"Income" , color: color.income},
                     {label:"Forecast" , color: color.forecast},
                     {label:"Budget" , color: color.budget},
                     {label:"Previous" , color: color.previousYear},
                     {label:"Expenditure" , color: color.expenditure},

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
      svg.style("background-color", "white");
      
      // Second Histogram Plot on the adjacent svg                      
      var height = svg.attr("height");
      var width  = svg.attr("width");

      // Extract income actual and cast it to number:
      var yData = data.map( function(d) { return +d["Inc-YTD-Act"]; });

      // Extract the cost centre number
      var xData = data.map( function(d) { return d[dashBoardData.financialsData.costCentreProperty]; });

      var margin = defineMargins(height, width);
      var vScales = getVerticalScales(svg, margin, yData);          
      var yScale = vScales.yScale;
      var hScale = vScales.hScale;        
      var xScale = d3.scale.ordinal()
                   .domain(d3.range(xData.length))
                   .rangeRoundBands( [margin.left, width - margin.right], .2);
      
      plotVerticalGrid( svg, margin, 25);
      plotHorisontalBars(svg, margin, xData, yData);
      plotXLabel( svg, margin, "Latest income of Cost Centres within the Locality")
      plotYLabel( svg, margin, "CC ID")
      
}   
