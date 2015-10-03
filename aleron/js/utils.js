/////////////////////////////////////////////
//          Utility Functions              //
/////////////////////////////////////////////

// Sums a given property in an Array, each array element
// is assumed to have that property
function sumArrayProperty( data, property)
{
    var sum = 0;
    var s   = 0;
    var badEntries = 0;
    for ( var i = 0; i < data.length; i++ )
    {
        // Try to convert each entry to a number:
        s = Number(data[i][property]);
        // check for NaNs:
        if ( isNaN(s) )
        {
            badEntries = badEntries + 1;
        }
        else
        {
            sum = sum + s;
        }
    }
    //alert("Total Entires: " + data.length + "\nMissing/Bad Entries: " + badEntries );
    return sum;
}

// Returns an object with four fields, each is an array of length 4
// one entry for each quarter.
function computeQuarterlyData(dataArray)
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

// 
function makeTableData(data)
{
    var tableHeader = ["Quantity", "Q1", "Q2", "Q3", "Q4", "FY", "Budget", "Variation", "Variation (%)"];
    var tableData = [];
    tableData.push(tableHeader);
    propertyName = ["actual", "forecast", "budget", "previous"];
    firstColumn = ["Actual", "Forecast", "Budget", "Previous"];

    for ( var i = 0; i < 4; i++ )
    {
        var row = [];
        row.push( firstColumn[i]);
        // array of 4 numbers (one for each quarters)
        row = row.concat( data[propertyName[i]]);
        // dummy entries to match the number of columns
        row = row.concat( [0, 0, 0, 0]);
        tableData.push(row);
    }    
    return tableData;
}

// tableData is an array, each element of which 
// is another array containing row data
// the first row is conisdered as the table head.
function updateTable( table, tableData)
{
    while ( table.rows.length > 0 )
    {
        table.deleteRow(0);
    }
    
    // Number of rows
    var M = tableData.length;
    // Number of columns
    var N = tableData[0].length;


    // Make table header
    var header = table.createTHead();
    var row = header.insertRow(0);
        
    for ( var j = 0; j < N; j++ )
    {
        var cell = row.insertCell(j);
        cell.innerHTML = tableData[0][j].bold();      
    }
     
    // Make remaining rows
    for ( var i = 1; i < M; i++ )
    {    
        var row;
        row = table.insertRow(i);
        
        for ( var j = 0; j < N; j++ )
        {
            var cell = row.insertCell(j);   
            // First entry is a string
            if ( j === 0)         
            {
                cell.innerHTML = tableData[i][j];
            }
            // Other entries are numbers:
            else
            {
                cell.innerHTML = dashBoardSettings.numberFormat( tableData[i][j]);
            }
        }
    }
    return table;    
}

// Example: Count how many times each locality (property) in 
// data occurs from the possible list of localities
function getIdentifierCount( dataArray, identifierList, property )
{
    // Funny way to initialize an array to 0:
    var count = identifierList.map(function(d) { return 0; } );

    for ( var i = 0; i < dataArray.length; i++ )
    {
        var thisEntry = dataArray[i][property];
        var thisIndex = identifierList.indexOf(thisEntry);
        count[thisIndex] = count[thisIndex] + 1;
    }
    return count;
}

function updateSelector( selectorID, optionList )
{
     // empty the existing selection box
     while ( selectorID.hasChildNodes() ) 
     {  
         selectorID.removeChild(selectorID.firstChild);
     }
     
     for( var i = 0; i < optionList.length; i++ )
     {
          var el = document.createElement("option");
          el.textContent = optionList[i];
          el.value = optionList[i];
          selectorID.appendChild(el);
     }
}



// Looks at array data and returns for each element the 
// property specified by property and returns a 
// list of elements under that property:
function getUniqueList( data, property)
{
     // Get the list of elements with the property:
     var list = data.map(function(d){ return d[property]; } );
     // Get unique elements only:
     list = list.filter( function(d, i, thisArray){ return thisArray.indexOf(d) === i; });
     return list; 
}

// Same as above but sorts the list as well:
function getUniqueSortedList( data, property)
{
    var list = getUniqueList( data, property);
    list = list.sort();
    return list;
}








