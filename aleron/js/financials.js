// ****************************************
//  Financials Utilities
//  *************************************//

// Returns an object with four fields, each is an array of length 4
// one entry for each quarter.
function computeQuarterlyFinancialData(dataArray)
{
    var data = {};
    data.actual = [];
    data.budget = [];
    data.forecast = [];
    data.previous = [];
    data.quarterNames = ["Q1", "Q2", "Q3", "Q4"];

    var property = [];

    for ( var i = 0; i < 4; i++ )
    {
        property = "Q" + (i+1) + " Forecast";
        data.forecast[i] = sumArrayProperty( dataArray, property);

        property = "Q" + (i+1) + " Budget";
        data.budget[i] = sumArrayProperty( dataArray, property);
        
        property = "Q" + (i+1) + " Actual";
        data.actual[i] = sumArrayProperty( dataArray, property);

        property = "Q" + (i+1) + " Previous";
        data.previous[i] = sumArrayProperty( dataArray, property);
    }
    return data;
}

function makeFinancialTableData(data)
{
    var tableHeader = ["Quantity", "Q1", "Q2", "Q3", "Q4", "FY", "Budget", "Variation", "Variation (%)"];
    var tableData = [];
    tableData.push(tableHeader);

    var propertyName = ["actual", "forecast", "budget", "previous"];
    var firstColumn = ["Actual", "Forecast", "Budget", "Previous"];

    for ( var i = 0; i < 4; i++ )
    {
        var row = [];
        row.push( firstColumn[i]);
        // array of 4 numbers (one for each quarters)
        var dataArray = data[propertyName[i]];
        for ( var j = 0; j < dataArray.length; j++ )
        {
            row.push(dashBoardSettings.numberFormat(dataArray[j]));
        }
        // dummy entries to match the number of columns
        row = row.concat( [0, 0, 0, 0]);
        tableData.push(row);
    }    
    return tableData;
}
