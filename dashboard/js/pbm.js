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
            var data = dashBoardData.peopleBizModelData;
            addNationProperty(data[propertyName], data.regionProperty, data.nationProperty);
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.peopleBizModelData[propertyName].length );
     }); // end of d3.csv()                                
 })();


(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.peopleBizModelData.files[1].name;
     var propertyName = dashBoardData.peopleBizModelData.files[1].propertyName;
     
     dashBoardData.peopleBizModelData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.peopleBizModelData[propertyName] = d;
            var data = dashBoardData.peopleBizModelData;
            addNationProperty(data[propertyName], data.regionProperty, data.nationProperty);
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
    var jobTypes = ["Director", "AD", "Manager", "Team Manager", "Teacher", "Specialist", "Practitioner", "Admin", "Other"];
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
                //if ( subTopRow[k] !== "HC" )
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


function updatePeopleBizModelTable( table, tableData)
{
    // Call the regular update table:
    table = updateTable(table, tableData);
    
    // Number of rows
    var M = tableData.length;
    // Number of columns
    var N = tableData[0].length;

    for ( var j = 1; j < N; j++ )
    {
        table.rows[0].cells[j].align = "right";
    }
    //return table;
}

function plotPeopleBizModelVisualisation(data, subLevelData, subLevelList, subAreaProperty, areaProperty, area )
{
    var financialsData = dataSelectFunction(dashBoardData.financialsData, areaProperty, area, computeQuarterlyFinancialsData);
    // Second Quarter
    var quarterIndex = 1;
    var income = financialsData.quarterlyData.income.quarterly[quarterIndex];
    var expenditure = financialsData.quarterlyData.expenditure.quarterly[quarterIndex];
    var currentQuarter = "Q2";
    var totalManagers = data["Manager"][currentQuarter]["HC"] + data["Team Manager"][currentQuarter]["HC"];

    // **************** First plot ********************
    var svg = d3.select(document.getElementById("SVG01"));
    svg.selectAll("*").remove();
    var height = svg.attr("height");
    var width = svg.attr("width");
    var pieData = [];
    var propertyName = [ "Director", "AD", "Manager", "Team Manager", "Teacher", "Specialist", "Practitioner", "Admin", "Other"];

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
    //pieStyle.cx = width/6;
    //pieStyle.cy = height/4;
    //pieStyle.outerRadius = width/6;
    //pieStyle.innerRadius = pieStyle.outerRadius/1.4;
    pieStyle.textEnabled = 1;
    pieStyle.tipEnabled = 0;

    var rayStyle = initRaySettings(pieStyle);
    var legendStyle = initLegendSettings(pieStyle);
    legendStyle.x = 10;
    legendStyle.y = height/2;


    var fileName = "staffData";
    var pie1 = plotPie(svg, pieData, dashBoardData.peopleBizModelData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title1 = addTitle(svg, "Head Count");

    var stackData = [];
    xData = ["Expenditure/TM (£k)", "", "Income/TM (£k)", "" ];
    yData = [expenditure/totalManagers, "", income/totalManagers, "" ];
    var numberOfStacksPerBar = 1;
    for ( var i = 0; i < numberOfStacksPerBar; i++ )
    {
        stackData[i] = [];
        for ( var j = 0; j < xData.length; j++ )
        {
            stackData[i][j] = {label: xData[j], y: yData[j], propertyName: "think", propertyValue: "about this"};
        }
    }

    var stackSettings = {};
    svg = d3.select(document.getElementById("SVG03"));
    height = svg.attr("height");
    width = svg.attr("width");
    svg.selectAll("*").remove();
    var margin = defineMargins(height, width);
    margin.left = 2*margin.left;
    stackSettings.margin = margin;
    stackSettings.color = pieStyle.color;
    plotStack(svg, stackData, subAreaProperty, dashBoardData.impactData, fileName, stackSettings );
    addTitle(svg, "HC Income per manager")
    // Update data table:
    var tableData = makePeopleBizModelTableData(data);
    updatePeopleBizModelTable( document.getElementById("dataTable"), tableData);

    // *********************** Second Plot ****************////
    svg = d3.select(document.getElementById("SVG02"));
    svg.selectAll("*").remove();
    height = svg.attr("height");
    width = svg.attr("width");
    currentQuarter = "Q2";
    pieData = [];
    for ( var i = 0; i < propertyName.length; i++ )
    {
        pieData.push( {label: propertyName[i], value: data[propertyName[i]][currentQuarter]["FTE"], propertyName: "Job Type", propertyValue: propertyName[i]});
    }

    var pieStyle = initPieSettings(width, height, d3.scale.category10());
    /*
    pieStyle.cx = width/6;
    pieStyle.cy = height/4;
    pieStyle.outerRadius = width/6;
    pieStyle.innerRadius = pieStyle.outerRadius/1.4;
    */
    pieStyle.textEnabled = 1;

    var rayStyle = initRaySettings(pieStyle);
    var legendStyle = initLegendSettings(pieStyle);
    legendStyle.x = 10;
    legendStyle.y = height/2;


    fileName = "staffData";
    var pie2 = plotPie(svg, pieData, dashBoardData.peopleBizModelData[fileName], areaProperty, area, legendData, pieStyle, rayStyle, legendStyle);
    var title2 = addTitle(svg, "Full Time Equivalent");

    totalManagers = data["Manager"][currentQuarter]["FTE"] + data["Team Manager"][currentQuarter]["FTE"];
    xData = ["Expenditure/TM (£k)","", "Income/TM (£k)", "" ];
    yData = [expenditure/totalManagers, "", income/totalManagers, "" ];
    numberOfStacksPerBar = 1;
    for ( var i = 0; i < numberOfStacksPerBar; i++ )
    {
        stackData[i] = [];
        for ( var j = 0; j < xData.length; j++ )
        {
            stackData[i][j] = {label: xData[j], y: yData[j], propertyName: "think", propertyValue: "about this"};
        }
    }

    stackSettings = {};
    svg = d3.select(document.getElementById("SVG04"));
    svg.selectAll("*").remove();
    height = svg.attr("height");
    width = svg.attr("width");
    margin = defineMargins(height, width);
    margin.left = 2*margin.left;
    stackSettings.margin = margin;
    stackSettings.color = pieStyle.color;
    plotStack(svg, stackData, subAreaProperty, dashBoardData.impactData, fileName, stackSettings )
    addTitle(svg, "FTE Income per manager")

    return;
}
