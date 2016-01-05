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
function computePeopleBizModelSubData(data, subLevelList, subLevelProperty)
{
   var subLevelData = [];
   for ( var i = 0; i < subLevelList.length; i++ )
   {
       var thisData = data.filter( function(d) { return d[subLevelProperty] === subLevelList[i];} );
       subLevelData[i] =  computeQuarterlyPeopleBizModelData(thisData);
   }
   return subLevelData;
}

// *******************************************************
//    People and Business Model Utility functions
// *****************************************************//
function computeQuarterlyPeopleBizModelData(peopleBizModelDataArray)
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
    
    // This is the object returned:
    var data = {};

    //var headerRow = ["Q1", "Q2", "Q3", "Q4"];
    // Only Q2 at the moment:
    var headerRow = ["Q2"];

    var jobPropertyName = "Job Type";
    var jobTypes = getUniqueSortedList(dashBoardData.peopleBizModelData.rawData, jobPropertyName);
    //var headerColumn = ["AD", "CSMs", "Team Managers", "CSM + Team Leaders", "Practitioners", "Administrators", "Others", "TOTAL"];
    var headerColumn = jobTypes;


    for ( var i = 0; i < jobTypes.length; i++ )
    {
        var temp =  peopleBizModelDataArray.filter( function(d) { return d[jobPropertyName] == jobTypes[i]; } );
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
   // plotQuarterlyBizDevData(svg, data);


    // Update data table:
    var tableData = makePeopleBizModelTableData(data);
    updateTable( document.getElementById("dataTable"), tableData);

    // *********************** Second Plot ****************////
    var height = svg.attr("height");
    var width = svg.attr("width");

    var propertyName = ["?"];

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

    function stackClick(d)
    {
        var label = stack.stackPlot.stackLayer.clickedData.data.label;
        var color = stack.stackPlot.stackLayer.clickedData.object.style("fill");
        var subData = dashBoardData.bizDevData.currentNationData.filter( function(d) { return d[subAreaProperty] == label; }); 
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
    pie.piePlot.piePath.on("click", pieClick);

    function pieClick(d)
    {
        /* Do nothing for the time being
        var label = pie.piePlot.piePath.clickedData.data.label;
        var color = pie.piePlot.piePath.clickedData.object.style("fill");
        var subData = dashBoardData.impactData.currentNationData.filter( function(d) { return d[subAreaProperty] == label; }); 
        var property = dashBoardData.impactData.impactColorToImpactProperty(color);
        subData = subData.filter(function(d) { return d[property] == 1; } );
        console.log(subData.length);
        openTablePage(subData);
        */
        return;
    }

    return pie;
}
