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
            console.log( dashBoardData.impactData[propertyName].length + " entries read.");
     }); // end of d3.csv()                                
 })();


// *******************************************************
//    Impact Measurement Utility Functions
// *****************************************************//
function computeQuarterlyImpactData(impactData)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/
    // Generic routine to compute quarterly data.     
    propertyNames = dashBoardData.impactData.files.map(function(d) { return d.propertyName; } );
    var externalInspectionsDataArray = impactData[propertyNames[0]];
    var impactDataArray = impactData[propertyNames[1]];

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
    data["Green"]["Q2"] = cData.length;
    data["Amber"]["Income"] = sumArrayProperty( cData, "TOTAL");

    cData = impactDataArray.filter( function(d) { return d["A"] == 1; } );
    data["Amber"]["Q2"] = cData.length;
    data["Amber"]["Income"] = sumArrayProperty( cData, "TOTAL");

    cData = impactDataArray.filter( function(d) { return d["R"] == 1; } );
    data["Red"]["Q2"] = cData.length;
    data["Red"]["Income"] = sumArrayProperty( cData, "TOTAL");

    data["Unscored"]["Q2"] = impactDataArray.length - data["Green"]["Q2"] - data["Amber"]["Q2"] - data["Red"]["Q2"];
    data["Unscored"]["Income"] = sumArrayProperty( impactDataArray, "TOTAL") - data["Green"]["Income"] - data["Amber"]["Income"] - data["Red"]["Income"];

    data["Total Number of Contracts"]["Q2"] = impactDataArray.length;
    data["Total Number of Contracts"]["Income"] = sumArrayProperty( impactDataArray, "TOTAL");

    // Outcomes as a %
    var nR = sumArrayProperty( impactDataArray, "R-Outcome");  
    var nA = sumArrayProperty( impactDataArray, "A-Outcome");  
    var nG = sumArrayProperty( impactDataArray, "G-Outcome");  
    var totalContracts = nR + nA + nG;
    data["Green (Outcomes)"]["Q2"] = nG / totalContracts * 100.0;
    data["Amber (Outcomes)"]["Q2"] = nA / totalContracts * 100.0;
    data["Red (Outcomes)"]["Q2"] = nR / totalContracts * 100.0;

    // % of beneficiary outcomes
    cData = impactDataArray.filter( function(d) { return d["Beneficiary Feedback Collected"] == "Yes"; } );
    data["Percentage %"]["Q2"] = cData.length/impactDataArray.length * 100;
    // Add extra fields to be used in visualisation:
    data["Feedback Collected"] = {};
    data["Feedback Collected"]["Q2"] = data["Percentage %"]["Q2"];
    data["No Feedback"] = {};
    data["No Feedback"]["Q2"] = 100.00 - data["Feedback Collected"]["Q2"];


    // External Inspections:
    // The first four entries of the headerRow must be quarter names
    var numOfQuarters = 2;
    var quarterNames = ["Q1", "Q2", "Q3", "Q4"];
    for ( var i = 0; i < numOfQuarters; i++ )
    {
       var quarterlyExternalInspectionsData = externalInspectionsDataArray.filter( function(d){ return d["Reporting Quarter"] === quarterNames[i]; } );
      data["Outstanding"][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Excellent/Outstanding"] == 1; } ).length;
      data["Good/Very Good"][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Good/Very Good"] == 1; } ).length;
      data["Satisfactory/Requires Improvement"][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Requires Improvement/Satisfactory/Adequate"] == 1; } ).length;
      data["Unsatisfactory"][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Unsatisfactory/Inadequate/Poor/Weak"] == 1; } ).length;
      data["Performance Unscored"][quarterNames[i]] = quarterlyExternalInspectionsData.filter( function(d) { return d["Unscored"] == 1; } ).length;
      data["Total"][quarterNames[i]] = quarterlyExternalInspectionsData.length;
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

function plotImpactVisualisation(data, subLevelData, subAreaProperty, subLevelList, areaProperty, area)
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


    var propertyTable = {
        "Red (Outcomes)": "R-Outcome",
        "Amber (Outcomes)": "A-Outcome",
        "Green (Outcomes)": "G-Outcome",
        "Red": "R",
        "Amber": "A",
        "Green": "G",
        "Feedback Collected": "Beneficiary Feedback Collected",
        "No Feedback": "Beneficiary Feedback Collected",
        "Outstanding": "Excellent/Outstanding",
        "Good/Very Good": "Good/Very Good",
        "Satisfactory/Requires Improvement": "Requires Improvement/Satisfactory/Adequate",
        "Unsatisfactory": "Unsatisfactory/Inadequate/Poor/Weak",
        "Performance Unscored": "Unscored"
    };

    // For second quarter:
    var currentQuarter = "Q2";
    var pieData = [];
    var propertyName = ["Red", "Amber", "Green", "Unscored"];
    var legendData = propertyName;
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: propertyName[i], value: data[propertyName[i]][currentQuarter], propertyName: propertyTable[propertyName[i]], propertyValue: 1});
    }

    var pieStyle = initPieSettings(width, height, dashBoardSettings.ragColors);
    var rayStyle = initRaySettings(pieStyle);
    var legendStyle = initLegendSettings(pieStyle);


    var pie = {};
    var fileName = "contractsData";
    var pie1 = plotPie(svg, pieData, dashBoardData.impactData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle)
    var title1 = addTitle(svg, "Overall Contract Perfromance (Total Contracts)");


    // *********************** Second Plot ****************////

    svg = d3.select(document.getElementById("SVG02"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    var stackSettings = {};
    stackSettings.color = pieStyle.color;
    var values = propertyName.map(function(d) { return 1; } );
    var stackData = makeImpactStackData(subLevelData, subLevelList, propertyName,values )
    var fileName = "contractsData";
    plotStack(svg, stackData, subAreaProperty, dashBoardData.impactData, fileName, stackSettings )
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
        pieData.push( {label: legendData[i], value: data[propertyName[i]][currentQuarter], propertyName: propertyTable[propertyName[i]], propertyValue: 1});
    }

    pieStyle.percentageEnabled = 1
    var pie4 = plotPie(svg, pieData, dashBoardData.impactData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title4 = addTitle(svg, "Outcome/Quality Performance (%)");

    /* ****************** Fourth Plot ***************************************/
    svg = d3.select(document.getElementById("SVG05"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    stackSettings.color = pieStyle.color;
    propertyName = ["Red (Outcomes)", "Amber (Outcomes)", "Green (Outcomes)"];
    values = propertyName.map(function(d) { return 1; } );
    stackData = makeImpactStackData(subLevelData, subLevelList, propertyName,values )
    fileName = "contractsData";
    plotStack(svg, stackData, subAreaProperty, dashBoardData.impactData, fileName, stackSettings )
    addTitle(svg, "Next Level Breakdown (%)")

    /*  ************************* Fifth Plot ***********************************/
    svg = d3.select(document.getElementById("SVG07"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    currentQuarter = "Q2";
    pieData = [];
    propertyName = ["No Feedback", "Feedback Collected"];
    values = ["", "Yes"];
    legendData = ["No Feedback", "Feedback Collected"];
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: legendData[i], value: data[propertyName[i]][currentQuarter], propertyName: propertyTable[propertyName[i]], propertyValue: values[i]});
    }

    var pie7 = plotPie(svg, pieData, dashBoardData.impactData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title7 = addTitle(svg, "Beneficiary Feedback Contracts (%)");

    /* ****************** Sixth Plot ***************************************/
    svg = d3.select(document.getElementById("SVG08"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    // Add fields to subLevelData 
    stackSettings.color = pieStyle.color;
    propertyName = ["No Feedback", "Feedback Collected"];
    values = ["", "Yes"];
    stackData = makeImpactStackData(subLevelData, subLevelList, propertyName, values)
    fileName = "contractsData";
    plotStack(svg, stackData, subAreaProperty, dashBoardData.impactData, fileName, stackSettings )
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
        pieData.push( {label: legendData[i], value: data[propertyName[i]][currentQuarter],  propertyName: propertyTable[propertyName[i]], propertyValue: 1});
    }

    fileName = "externalInspectionsData";
    var pie10 = plotPie(svg, pieData, dashBoardData.impactData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title10 = addTitle(svg, "External Inspections (Total)");

    /* ****************** Eight Plot ***************************************/
    svg = d3.select(document.getElementById("SVG11"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    // Add fields to subLevelData 
    stackSettings = {};
    stackSettings.color = pieStyle.color;
    values = propertyName.map(function(d) { return 1; } );
    stackData = makeImpactStackData(subLevelData, subLevelList, propertyName, values)
    plotStack(svg, stackData, subAreaProperty, dashBoardData.impactData, fileName, stackSettings )
    addTitle(svg, "Next Level Breakdown (Total)")

    return;
}

function makeImpactStackData(data, subLevelList, propertyNames, values)
{
    var propertyTable = {
        "Red (Outcomes)": "R-Outcome",
        "Amber (Outcomes)": "A-Outcome",
        "Green (Outcomes)": "G-Outcome",
        "Red": "R",
        "Amber": "A",
        "Green": "G",
        "Feedback Collected": "Beneficiary Feedback Collected",
        "No Feedback": "Beneficiary Feedback Collected",
        "Outstanding": "Excellent/Outstanding",
        "Good/Very Good": "Good/Very Good",
        "Satisfactory/Requires Improvement": "Requires Improvement/Satisfactory/Adequate",
        "Unsatisfactory": "Unsatisfactory/Inadequate/Poor/Weak",
        "Performance Unscored": "Unscored"
    };

    var stackData = [];
    for ( var i = 0; i < propertyNames.length; i++ )
    {
        stackData[i] = [];
        for ( var j = 0; j < data.length; j++ )
        {
            stackData[i][j] = {label: subLevelList[j], y: data[j][propertyNames[i]]["Q2"], propertyName: propertyTable[propertyNames[i]], propertyValue: values[i]};
        }
    }
    return stackData;
}
