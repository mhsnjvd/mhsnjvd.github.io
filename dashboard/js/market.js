// *******************************************************
//    Market Data Measurement Initialisatoins
// *****************************************************//
//
// Read all the files needed for market measurement:

// Read file 0:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.marketData.files[0].name;
     var propertyName = dashBoardData.marketData.files[0].propertyName;
     
     dashBoardData.marketData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.marketData[propertyName] = d;
            var data = dashBoardData.marketData
            addNationProperty(data[propertyName], data.regionProperty, data.nationProperty);
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.marketData[propertyName].length + " entries read.");
     }); // end of d3.csv()                                
 })();

(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.marketData.files[1].name;
     var propertyName = dashBoardData.marketData.files[1].propertyName;
     
     dashBoardData.marketData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.marketData[propertyName] = d;
            var data = dashBoardData.marketData
            addNationProperty(data[propertyName], data.regionProperty, data.nationProperty);
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.marketData[propertyName].length + " entries read.");
     }); // end of d3.csv()                                
 })();

(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.marketData.files[2].name;
     var propertyName = dashBoardData.marketData.files[2].propertyName;
     
     dashBoardData.marketData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.marketData[propertyName] = d;
            var data = dashBoardData.marketData
            addNationProperty(data[propertyName], data.regionProperty, data.nationProperty);
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.marketData[propertyName].length + " entries read.");
     }); // end of d3.csv()                                
 })();

(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.marketData.files[3].name;
     var propertyName = dashBoardData.marketData.files[3].propertyName;
     
     dashBoardData.marketData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.marketData[propertyName] = d;
            var data = dashBoardData.marketData
            addNationProperty(data[propertyName], data.regionProperty, data.nationProperty);
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.marketData[propertyName].length + " entries read.");
     }); // end of d3.csv()                                
 })();

(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.marketData.files[4].name;
     var propertyName = dashBoardData.marketData.files[4].propertyName;
     
     dashBoardData.marketData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.marketData[propertyName] = d;
            var data = dashBoardData.marketData
            addNationProperty(data[propertyName], data.regionProperty, data.nationProperty);
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.marketData[propertyName].length + " entries read.");
     }); // end of d3.csv()                                
 })();


// *******************************************************
//    Market Measurement Utility Functions
// *****************************************************//
function computeQuarterlyMarketData(marketData)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/
    // Generic routine to compute quarterly data.     
    propertyNames = dashBoardData.marketData.files.map(function(d) { return d.propertyName; } );
    var years = getUniqueSortedList(marketData.marketDataUK, "Year" );

    // This is the object returned:
    var data = {};

    return data;
}

function makeMarketTableData(data)
{
}


// table is the ID of the html table element
// tableData is an array, each element of which 
// is another array containing row data
// the first row is conisdered as the table head.
function updateMarketTable( table, tableData)
{
    return table;    
}

function plotMarketVisualisation(data, subLevelData, subAreaProperty, subLevelList, areaProperty, area)
{
    // Update data table:
    /*
    var tableData = makeMarketTableData(data);
    updateMarketTable( document.getElementById("dataTable"), tableData);

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
    var pie1 = plotPie(svg, pieData, dashBoardData.marketData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle)
    var title1 = addTitle(svg, "Overall Contract Perfromance (Total Contracts)");


    // *********************** Second Plot ****************////
    /*

    svg = d3.select(document.getElementById("SVG02"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    var stackSettings = {};
    stackSettings.color = pieStyle.color;
    var values = propertyName.map(function(d) { return 1; } );
    var stackData = makeMarketStackData(subLevelData, subLevelList, propertyName,values )
    var fileName = "contractsData";
    plotStack(svg, stackData, subAreaProperty, dashBoardData.marketData, fileName, stackSettings )
    addTitle(svg, "Breakdown (Total No. of Contracts)"); 

    */

    // ******************** Third Plot ******************************///
    /*

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
    var pie4 = plotPie(svg, pieData, dashBoardData.marketData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title4 = addTitle(svg, "Outcome/Quality Performance (%)");
    */

    /* ****************** Fourth Plot ***************************************/
    /*
    svg = d3.select(document.getElementById("SVG05"));
    svg.selectAll("*").remove();
    svg.style("background-color", "white");

    stackSettings.color = pieStyle.color;
    propertyName = ["Red (Outcomes)", "Amber (Outcomes)", "Green (Outcomes)"];
    values = propertyName.map(function(d) { return 1; } );
    stackData = makeMarketStackData(subLevelData, subLevelList, propertyName,values )
    fileName = "contractsData";
    plotStack(svg, stackData, subAreaProperty, dashBoardData.marketData, fileName, stackSettings )
    addTitle(svg, "Next Level Breakdown (%)")
    */


    return;
}
