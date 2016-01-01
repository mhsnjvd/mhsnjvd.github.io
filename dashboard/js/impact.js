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
function computeImpactSubData(data1, data2, subLevelList, subLevelProperty)
{
   var subLevelData1 = [];
   var subLevelData2 = [];
   var subLevelData = [];
   for ( var i = 0; i < subLevelList.length; i++ )
   {
       subLevelData1[i] = data1.filter( function(d) { return d[subLevelProperty] === subLevelList[i];} );
       subLevelData2[i] = data2.filter( function(d) { return d[subLevelProperty] === subLevelList[i];} );
       subLevelData[i] = computeQuarterlyImpactData(subLevelData1[i], subLevelData2[i]);
   }
   return subLevelData;
}

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

    // Outcomes as a %
    var nR = sumArrayProperty( impactDataArray, "R-Outcome");  
    var nA = sumArrayProperty( impactDataArray, "A-Outcome");  
    var nG = sumArrayProperty( impactDataArray, "G-Outcome");  
    var totalContracts = nR + nA + nG; 
    data[headerColumn[5]][headerRow[1]] = nG / totalContracts * 100.0;
    data[headerColumn[6]][headerRow[1]] = nA / totalContracts * 100.0;
    data[headerColumn[7]][headerRow[1]] = nR / totalContracts * 100.0;

    // % of beneficiary outcomes
    cData = impactDataArray.filter( function(d) { return d["Beneficiary Feedback Collected"] == "Yes"; } );
    data[headerColumn[8]][headerRow[1]] = cData.length/impactDataArray.length * 100;
    // Add extra fields to be used in visualisation:
    data["Good Feedback"] = {};
    data["Good Feedback"]["Q2"] = data[headerColumn[8]][headerRow[1]];
    data["No Feedback"] = {};
    data["No Feedback"]["Q2"] = 100.00 - data["Good Feedback"]["Q2"];
    data["Negative Feedback"] = {};
    data["Negative Feedback"]["Q2"] = 0.0; // Oh yeah!!!


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
    var tableHeadings = ["Overall Contract Performance", "Outcomes/Quality Performance (%)", "Contracts with Beneficiary Feedback", "Number of CYP", "External Inspections"];
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
            // Align all but the first column to the right:
            if ( j !== 0 )
            {
                cell.align = "right";
            }
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


    // TODO: this is a dirty solution for removing 
    // the "Income" column in all but the first 
    // subtable
    for ( var i = headerIndices[2]; i < M; i++ )
    {
        table.rows[i].cells[N-1].innerHTML = "";
    }

    return table;    
}


function plotImpactVisualisation(data, subLevelData, subLevelList, areaProperty, area, subAreaProperty)
{
    // Update data table:
    var tableData = makeImpactTableData(data);
    updateImpactTable( document.getElementById("dataTable"), tableData);

    //**************** First plot ********************
    svg = d3.select(document.getElementById("SVG01"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white"); 
    var height = svg.attr("height");
    var width = svg.attr("width");

    // For second quarter:
    var currentQuarter = "Q2";
    var pieData = [];
    var propertyName = ["Red", "Amber", "Green", "Unscored"];
    var legendData = propertyName;
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: propertyName[i], count: data[propertyName[i]][currentQuarter]});
    }

    var pieStyle = initPieSettings(width, height);
    var rayStyle = initRaySettings(pieStyle);
    var legendStyle = initLegendSettings(pieStyle);


    var pie1 = plotPie(svg, pieData, legendData, pieStyle, rayStyle, legendStyle);
    var title1 = addTitle(svg, "Overall Contract Perfromance (%)");

    // *********************** Second Plot ****************////

    svg = d3.select(document.getElementById("SVG02"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    var stackSettings = {};
    stackSettings.color = pieStyle.color;
    plotStack(svg, subLevelData, propertyName, subLevelList, stackSettings, areaProperty, area, subAreaProperty);
    addTitle(svg, "Breakdown (Total No. of Contracts)"); 


    // ******************** Third Plot ******************************///

    svg = d3.select(document.getElementById("SVG04"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    currentQuarter = "Q2";
    pieData = [];
    propertyName = ["Red (Outcomes)", "Amber (Outcomes)", "Green (Outcomes)"];
    legendData = ["Red", "Amber", "Green"];
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: legendData[i], count: data[propertyName[i]][currentQuarter]});
    }

    var pie4 = plotPie(svg, pieData, legendData, pieStyle, rayStyle, legendStyle);
    var title4 = addTitle(svg, "Outcome/Quality Performance (%)");

    /* ****************** Fourth Plot ***************************************/
    svg = d3.select(document.getElementById("SVG05"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    stackSettings.color = pieStyle.color;
    plotStack(svg, subLevelData, propertyName, subLevelList, stackSettings, areaProperty, area, subAreaProperty);
    addTitle(svg, "Next Level Breakdown (%)")

    /*  ************************* Fifth Plot ***********************************/
    svg = d3.select(document.getElementById("SVG07"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    currentQuarter = "Q2";
    pieData = [];
    propertyName = ["Negative Feedback", "No Feedback", "Good Feedback"];
    legendData = ["-ve Feedback", "No Feedback", "+ve Feedback"];
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: legendData[i], count: data[propertyName[i]][currentQuarter]});
    }

    var pie7 = plotPie(svg, pieData, legendData, pieStyle, rayStyle, legendStyle);
    var title7 = addTitle(svg, "Beneficiary Feedback Contracts (%)");

    /* ****************** Sixth Plot ***************************************/
    svg = d3.select(document.getElementById("SVG08"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    // Add fields to subLevelData 
    stackSettings.color = pieStyle.color;
    plotStack(svg, subLevelData, propertyName, subLevelList, stackSettings, areaProperty, area, subAreaProperty);
    addTitle(svg, "Next Level Breakdown (%)")

    /*  ************************* Seventh Plot ***********************************/
    svg = d3.select(document.getElementById("SVG10"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    currentQuarter = "Q2";
    pieData = [];
    propertyName = ["Performance Unscored", "Unsatisfactory", "Satisfactory/Requires Improvement", "Good/Very Good", "Outstanding"];
    legendData = ["Unscored", "Unsatisfactory","Satisfactory", "Good", "Outstanding"];
    pieStyle.color = d3.scale.category20();
    legendStyle.color = pieStyle.color;
    rayStyle.color = pieStyle.color;
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: legendData[i], count: data[propertyName[i]][currentQuarter]});
    }

    var pie10 = plotPie(svg, pieData, legendData, pieStyle, rayStyle, legendStyle);
    var title10 = addTitle(svg, "External Inspections (%)");

    /* ****************** Eight Plot ***************************************/
    svg = d3.select(document.getElementById("SVG11"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    // Add fields to subLevelData 
    stackSettings = {};
    stackSettings.color = pieStyle.color;
    plotStack(svg, subLevelData, propertyName, subLevelList, stackSettings, areaProperty, area, subAreaProperty);
    addTitle(svg, "Next Level Breakdown (%)")

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
            layeredData[i][j] = {label: nameList[j], y: data[j][layerNames[i]]["Q2"]};
        }
    }

    stack.stackPlot = new stackObjectConstructor(svg, layeredData, stackSettings);

    stack.stackPlot.stackLayer.on("click", stackClick);
    

    function stackClick(d)
    {
        return ;

    }


    
}


function openTablePage(tableData)
{
    dashBoardData.impactData.selectedData = tableData;
    var tablePageWindow = window.open("./table.html");
    tablePageWindow.selecteData = tableData;
}

//function pieCreator()
// svg is d3 selected svg
// pieData is an array of objects with format: 
// pieData = [ {label: xxxx, count: xxxx}, {}, {}, ...]
function plotPie(svg, pieData, legendData, pieStyle, rayStyle, legendStyle)
{
    // The mother of all objects:
    var pie = {};

    var dataSet = pieData.map(function(d){ return d.count; } );
    var dummyData = dataSet.map(function(d) { return 1.0; } );

    pie.piePlot = new pieObjectConstructor(svg, dummyData, pieStyle);
    pie.piePlot.update(dataSet);

    pie.rayPlot = new rayObjectConstructor(svg, dataSet, rayStyle);
    pie.legend = new legendObjectConstructor( svg, legendData, legendStyle )

    // Update everything in the pie:
    pie.update = function(data)
    {
        pie.piePlot.update(data);
        pie.rayPlot.update(data);
    }
    pie.piePlot.piePath.on("click", function(d)
            { 
                var p = d3.select(this);
                p.style("fill", "blue");
            });


    return pie;
}
