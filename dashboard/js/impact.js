// *******************************************************
//    Impact Measurement Initialisatoins
// *****************************************************//
//
// Read all the files needed for impact measurement:

// Read file 0:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.impactData.files[0].name;
     var propertyName = dashBoardData.impactData.files[0].propertyName;
     
     dashBoardData.impactData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.impactData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.impactData[propertyName].length );
     }); // end of d3.csv()                                
 })();


// *******************************************************
//    Impact Measurement Utility Functions
// *****************************************************//
function computeQuarterlyImpactData(impactDataArray, externalInspectionsDataArray)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/
    // Generic routine to compute quarterly data.     

    // This is the object returned:
    var data = {};

    var headerColumn = ["Green", "Amber", "Red", "Unscored", "Total Number of Contracts", "Green (Outcomes)", "Amber (Outcomes)", "Red (Outcomes)", "Percentage %", "#CYP WS work with intensively", "#CYP WS work with", "Outstanding", "Good/Very Good", "Satisfactory/Requires Improvement", "Unsatisfactory", "Performance Unscored", "Total"];
    var headerRow = ["Q1", "Q2", "Q3", "Q4", "Income"];

    for ( var i = 0; i < headerColumn.length; i++ )
    {
        data[headerColumn[i]] = {};
        for ( var j = 0; j < headerRow.length; j++ )
        {
            data[headerColumn[i]][headerRow[j]] = 0.0;
        }
    }

    // Count the number of G, A, R, missing and total for the second quarter
    var cData = impactDataArray.filter( function(d) { return d["G"] == 1; } );
    data[headerColumn[0]][headerRow[1]] = cData.length;
    data[headerColumn[0]][headerRow[4]] = sumArrayProperty( cData, "TOTAL");

    cData = impactDataArray.filter( function(d) { return d["A"] == 1; } );
    data[headerColumn[1]][headerRow[1]] = cData.length;
    data[headerColumn[1]][headerRow[4]] = sumArrayProperty( cData, "TOTAL");

    cData = impactDataArray.filter( function(d) { return d["R"] == 1; } );
    data[headerColumn[2]][headerRow[1]] = cData.length;
    data[headerColumn[2]][headerRow[4]] = sumArrayProperty( cData, "TOTAL");

    data[headerColumn[3]][headerRow[1]] = impactDataArray.length - data[headerColumn[0]][headerRow[1]] - data[headerColumn[1]][headerRow[1]] - data[headerColumn[2]][headerRow[1]];
    data[headerColumn[3]][headerRow[4]] = sumArrayProperty( impactDataArray, "TOTAL") - data[headerColumn[0]][headerRow[4]] - data[headerColumn[1]][headerRow[4]] - data[headerColumn[2]][headerRow[4]];

    data[headerColumn[4]][headerRow[1]] = impactDataArray.length;
    data[headerColumn[4]][headerRow[4]] = sumArrayProperty( impactDataArray, "TOTAL");

    // Outcomes
    data[headerColumn[5]][headerRow[1]] = sumArrayProperty( impactDataArray, "G-Outcome");
    data[headerColumn[6]][headerRow[1]] = sumArrayProperty( impactDataArray, "A-Outcome");
    data[headerColumn[7]][headerRow[1]] = sumArrayProperty( impactDataArray, "R-Outcome");


    // External Inspections:
    // The first four entries of the headerRow must be quarter names
    var numOfQuarters = 2;
    var quarterNames = ["Q1", "Q2", "Q3", "Q4"];
    for ( var i = 0; i < numOfQuarters; i++ )
    {
       var quarterlyExternalInspectionsData = externalInspectionsDataArray.filter( function(d){ return d["Reporting Quarter"] === quarterNames[i]; } );
      data[headerColumn[11]][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Excellent/Outstanding"] == 1; } ).length;
      data[headerColumn[12]][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Good/Very Good"] == 1; } ).length;
      data[headerColumn[13]][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Requires Improvement/Satisfactory/Adequate"] == 1; } ).length;
      data[headerColumn[14]][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Unsatisfactory/Inadequate/Poor/Weak"] == 1; } ).length;
      data[headerColumn[15]][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Unscored"] == 1; } ).length;
      data[headerColumn[16]][quarterNames[i]] = quarterlyExternalInspectionsData.length;
    }

    return data;
}

function makeImpactTableData(data)
{
    var tableData = [];

    if ( (data === undefined) || data.length === 0 )
    {
        console.log( 'makeImpactTableData(data):data is undefined or of zero length');
        return;
    }

    // TODO: None of these should be empty! do an error check on this
    var firstColumn = Object.getOwnPropertyNames(data);
    var topRow      = Object.getOwnPropertyNames(data[firstColumn[0]]);

    // Make the top header rows for each table
    var tableHeaders = [];
    var tableHeadings = ["Overall Contract Performance", "Outcomes/ Quality Performance", "Contracts with Beneficiary Feedback", "Number of CYP", "External Inspections"];
    for ( var i = 0; i < tableHeadings.length; i++ )
    {
        var thisHeader = [tableHeadings[i]];
        tableHeaders[i] = thisHeader.concat(topRow);
    }

    // Number of properties in each subtable
    var propertyCount = [5, 3, 1, 2, 6]; 
    // Add rows corresponding to each table
    var j = 0;
    for ( var i = 0; i < tableHeadings.length; i++ )
    {
        tableData.push(tableHeaders[i]);
        var k = 0;
        while ( k < propertyCount[i] )
        {
            var row = [];
            row.push( firstColumn[j] );
            for ( var l = 0; l < topRow.length; l++ )
            {
                var thisEntry = +data[firstColumn[j]][topRow[l]];
                // Convert to our standard dashboard format
                thisEntry = dashBoardSettings.numberFormat( +data[firstColumn[j]][topRow[l]] );
                row.push(thisEntry);
            }
            tableData.push(row);
            k = k + 1;
            j = j + 1;
        }
        // Push an empty row for all but the last sub table
        if ( i < (tableHeadings.length - 1) )
        {
           var row = [];
           row.push( "" );
           for ( var l = 0; l < topRow.length; l++ )
           {
               row.push("");
           }
           tableData.push(row);
        }
    }

    return tableData;
}


// table is the ID of the html table element
// tableData is an array, each element of which 
// is another array containing row data
// the first row is conisdered as the table head.
function updateImpactTable( table, tableData)
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
    // Last row is also header for total :)
    var headerIndices = [0, 5, 7, 12, 15, 19, M-1];

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
function plotQuarterlyImpactData( svg, data)
{
      svg.selectAll("*").remove();
      svg.style("background-color", "whitesmoke"); 
      var height = svg.attr("height");
      var width = svg.attr("width");


      // For second quarter:
      var currentQuarter = "Q2";
      var pieData = [];
      var color = ["Green", "Amber", "Red", "Unscored"];
      var pieColors = ["Green", "#FFBF00", "Red", "Gray"];
      for ( var i = 0; i < color.length; i++ )
      {
          pieData.push( {label: color[i], count: data[color[i]][currentQuarter]});
      }
      
      plotPieChart( svg, pieData, pieColors);
}

function plotRegionalContractsCount( svg )
{
      svg.selectAll("*").remove();
      svg.style("background-color", "whitesmoke"); 
      var height = svg.attr("height");
      var width = svg.attr("width");


      // For second quarter:
      var pieData = [];
      var region = dashBoardData.impactData.regionList;
      // Delete the fist element, which is not a region
      region.shift();
      for ( var i = 0; i < region.length; i++ )
      {
          var thisRegion = dashBoardData.impactData.rawData.filter( function(d){ return d[dashBoardData.impactData.regionProperty] == region[i]; } );
          pieData.push( {label: region[i], count: thisRegion.length});
      }
      
      plotPieChart( svg, pieData);
}
