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

    var headerColumn = ["AD", "CSMs", "Team Managers", "CSM + Team Leaders", "Practitioners", "Administrators", "Others", "TOTAL"];
    //var headerRow = ["Q1", "Q2", "Q3", "Q4"];
    // Only Q1 at the moment:
    var headerRow = ["Q1"];
    var quantityForEachSubColumn = ["HC", "FTE"];

    for ( var i = 0; i < headerColumn.length; i++ )
    {
        data[headerColumn[i]] = {};
        for ( var j = 0; j < headerRow.length; j++ )
        {
            data[headerColumn[i]][headerRow[j]] = {};
            for ( var k = 0; k < quantityForEachSubColumn.length; k++ )
            {
                // var property = dashBoardData.peopleBizModelData.propertyList[2]; 
                // TODO: How to have a list of functions to compute for each quantity?
                //var computedQuantity = sumArrayProperty( peopleBizModelDataArray, property);
                var computedQuantity = 0.0;
                if ( quantityForEachSubColumn[k] == "HC" )
                {
                    // This is just the head count:
                    computedQuantity = peopleBizModelDataArray.length;
                }

                if ( quantityForEachSubColumn[k] == "FTE" )
                {
                    // Full time Equivalent
                    var property = dashBoardData.peopleBizModelData.propertyList[12];
                    computedQuantity = sumArrayProperty( peopleBizModelDataArray, property);
                }

                data[headerColumn[i]][headerRow[j]][quantityForEachSubColumn[k]] = computedQuantity;
            }
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
        console.log(topRow.length);
        for ( var j = 0; j < topRow.length; j++ )
        {
            for ( var k = 0; k < subTopRow.length; k++ )
            {
                // Ensure that this is a number
                var thisEntry = +data[firstColumn[i]][topRow[j]][subTopRow[k]];
                console.log("This Entry = " + thisEntry );
                row.push(thisEntry);
            }
        }
        tableData.push(row);
    }
    return tableData;
}
