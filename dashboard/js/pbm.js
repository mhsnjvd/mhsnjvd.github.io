// **************************************************
// Initialisations for People and Business Model
// **************************************************
//
// Read all the files needed:

// Read file 0:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.peopleBizModelData.files[0].name;
     var propertyName = dashBoardData.peopleBizModelData.files[0].propertyName;
     
     dashBoardData.peopleBizModelData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.peopleBizModelData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.peopleBizModelData[propertyName].length );
     }); // end of d3.csv()                                
 })();


// *******************************************************
//    People and Business Model Utility functions
// *****************************************************//
function computeQuarterlyPeopleBizModelData(peopleBizModelData)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/
    // Generic routine to compute quarterly data. Here is the format:
    // Main fields of the object data will be the entries of the first column
    // each field is an object and the fields of this object are d
    //
    //
    //                        data[property][ColumnHeading1]                                data[property][ColumnHeading2] ...
    //                    data[prop][ColHead1][sub1] data[prop][ColHead1][sub2]...   data[prop][ColHead2][sub1] data[prop][ColHead2][sub2]...
    //    data[property1]
    //    data[property2]
    //       .
    //       .
    //       .
    
    var fileNames = dashBoardData.peopleBizModelData.files.map(function(d) { return d.propertyName; });
    var staffData = peopleBizModelData[fileNames[fileNames.length - 1]];
    // This is the object returned:
    var data = {};

    //var headerRow = ["Q1", "Q2", "Q3", "Q4"];
    // Only Q2 at the moment:
    var headerRow = ["Q2"];

    var jobPropertyName = "Job Type";
    var jobTypes = getUniqueSortedList(dashBoardData.peopleBizModelData[fileNames[fileNames.length - 1]], jobPropertyName);
    //var headerColumn = ["AD", "CSMs", "Team Managers", "CSM + Team Leaders", "Practitioners", "Administrators", "Others", "TOTAL"];
    var headerColumn = jobTypes;


    for ( var i = 0; i < jobTypes.length; i++ )
    {
        var temp =  staffData.filter( function(d) { return d[jobPropertyName] == jobTypes[i]; } );
        data[headerColumn[i]] = {};
        for ( var j = 0; j < headerRow.length; j++ )
        {
            data[headerColumn[i]][headerRow[j]] = {};
            data[headerColumn[i]][headerRow[j]]["HC"] = temp.length;
            data[headerColumn[i]][headerRow[j]]["FTE"] = sumArrayProperty(temp, "FTE_Normal hours/37");
        }
    }
    return data;
}

function makePeopleBizModelTableData(data)
{
    var tableData = [];

    if ( (data === undefined) || data.length === 0 )
    {
        console.log( 'makePeopleBizModelTableData(data):data is undefined or of zero length');
        return;
    }

    // TODO: None of these should be empty! do an error check on this
    var firstColumn = Object.getOwnPropertyNames(data);
    var topRow      = Object.getOwnPropertyNames(data[firstColumn[0]]);
    var subTopRow   = Object.getOwnPropertyNames(data[firstColumn[0]][topRow[0]]);

    // Make the top header rows of the table:
    var tableHeader = ["Staff"];
    for ( var i = 0; i < topRow.length; i++ )
    {
        for ( var j = 0; j < subTopRow.length; j++ )
        {
            var str = subTopRow[j] + " (" + topRow[i] + ")";
            tableHeader.push(str);
        }
    }

    tableData.push(tableHeader);

    for ( var i = 0; i < firstColumn.length; i++ )
    {
        var row = [];
        row.push( firstColumn[i] );
        //console.log(topRow.length);
        for ( var j = 0; j < topRow.length; j++ )
        {
            for ( var k = 0; k < subTopRow.length; k++ )
            {
                var thisEntry = +data[firstColumn[i]][topRow[j]][subTopRow[k]];
                // Don't add decimals if it's a head count
                if ( subTopRow[k] !== "HC" )
                {
                    thisEntry = dashBoardSettings.numberFormat( +data[firstColumn[i]][topRow[j]][subTopRow[k]] );
                }
                row.push(thisEntry);
            }
        }
        tableData.push(row);
    }
    return tableData;
}

function plotPeopleBizModelVisualisation(data, subLevelData, subLevelList, subAreaProperty, areaProperty, area )
{
    // **************** First plot ********************
    var svg = d3.select(document.getElementById("SVG01"));
    var height = svg.attr("height");
    var width = svg.attr("width");
    var currentQuarter = "Q2";
    var pieData = [];
    var propertyName = Object.getOwnPropertyNames(data);

    var propertyTable = {
        "HC": "Normal Hours SUM",
        "FTE": "FTE_Normal hours/37"
    };

    var legendData = propertyName;
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: propertyName[i], value: data[propertyName[i]][currentQuarter]["HC"], propertyName: "Job Type", propertyValue: propertyName[i]});
    }

    var pieStyle = initPieSettings(width, height, d3.scale.category10());
    pieStyle.cx = width/6;
    pieStyle.cy = height/4;
    pieStyle.outerRadius = width/6;
    pieStyle.innerRadius = pieStyle.outerRadius/1.4;
    pieStyle.textEnabled = 0;

    var rayStyle = initRaySettings(pieStyle);
    var legendStyle = initLegendSettings(pieStyle);
    legendStyle.x = 10;
    legendStyle.y = height/2;


    var fileName = "staffData";
    var pie1 = plotPie(svg, pieData, dashBoardData.peopleBizModelData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title1 = addTitle(svg, "Head Count %");

    // Update data table:
    var tableData = makePeopleBizModelTableData(data);
    updateTable( document.getElementById("dataTable"), tableData);

    // *********************** Second Plot ****************////
    svg = d3.select(document.getElementById("SVG02"));
    height = svg.attr("height");
    width = svg.attr("width");
    currentQuarter = "Q2";
    pieData = [];
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: propertyName[i], value: data[propertyName[i]][currentQuarter]["FTE"], propertyName: "Job Type", propertyValue: propertyName[i]});
    }

    var pieStyle = initPieSettings(width, height, d3.scale.category10());
    pieStyle.cx = width/6;
    pieStyle.cy = height/4;
    pieStyle.outerRadius = width/6;
    pieStyle.innerRadius = pieStyle.outerRadius/1.4;
    pieStyle.textEnabled = 0;

    var rayStyle = initRaySettings(pieStyle);
    var legendStyle = initLegendSettings(pieStyle);
    legendStyle.x = 10;
    legendStyle.y = height/2;


    fileName = "staffData";
    var pie2 = plotPie(svg, pieData, dashBoardData.peopleBizModelData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title2 = addTitle(svg, "Full Time Equivalent %");

    return;
}
