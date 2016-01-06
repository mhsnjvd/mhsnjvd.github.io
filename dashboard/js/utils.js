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


// tableData is an array, each element of which 
// is another array containing row data
// the first row is conisdered as the table head.
// existing table will be deleted
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
            cell.innerHTML = tableData[i][j];
        }
    }
    return table;    
}


// jsonData is an array with each element being in json style: 
//       jsonData = [{prop: value, ...}, {prop: value, ...}, ... ]
// tableArray is returned:
//  tableArray = [[prop, prop, ..], [value, value, ...], [value, value, ..]... ]
// eventually calls updateTable()
function jsonToArray(jsonData)
{
    keys = Object.getOwnPropertyNames(jsonData[0]);

    var tableArray = [];
    for ( var i = 0; i < jsonData.length; i++ )
    {
        var row = [];
        for ( var j = 0; j < keys.length; j++ )
        {
            row[j] = jsonData[i][keys[j]];
        }
        tableArray[i] = row;
    }

    // Add header row:
    tableArray.unshift(keys);
    return tableArray
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
    if ( optionList === undefined )
    {
        // TODO: Do better error handling.
        console.log('updateSelector():optionList is undefined');
        console.log('The call came from ' +  arguments.callee.caller );
        return;
    }
     
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

// Assumes every property in the object is an array
// joins all these arrays into a single array and 
// returns it
function concatObjectArrays(obj)
{
    var singleArray = [];
    for ( var property in obj )
    {
        singleArray = singleArray.concat( obj[property] );
    }
    return singleArray;
}
    


// Object DATA has arrays specified by ARRAYNAMES.
// Search these arrays for PROPERTY == VALUE
// and return an object with filtered arrays
function searchPropertyInArrays( data, arrayNames, property, value )
{
    var filteredData = {};

    if ( value === undefined )
    {
        console.log( "utils:searchPropertyInArrays: must specify what to search for." );
    }

    for ( var i = 0; i < arrayNames.length; i++ )
    {
        var dataArray = data[arrayNames[i]]; 

        if ( dataArray === undefined )
        {
            console.log( "utils:searchPropertyInArrays: the property " + arrayNames[i] + " not found." );
        }

        // This is the key search line:
        filteredData[arrayNames[i]] = dataArray.filter( function(d) { return d[property] === value; } );
    }

    return filteredData;

}


// Add properties to an object
// Properties themselves are added
// as empty objects
function addObjectProperties(obj, propertyList)                                                                                                           {
    for ( var i = 0; i < propertyList.length; i++ )
    {
        obj[propertyList[i]] = {};
    }
    return obj;
}

// Cumsum array
function cumsumArray(data)
{
    var cumulativeData = data;
    for ( var i = 1; i < data.length; i++ )
    {
        cumulativeData[i] = data[i] + cumulativeData[i-1];
    }
    return cumulativeData;
}



function openTablePage(tableData)
{
    var tablePageWindow = window.open("./table.html");
    tablePageWindow.selecteData = tableData;
}


// data is an object, some of whose properties are arrays and contain data from individual files.
// The names of these properties are in the variable propertyNames
// the quarterly data is computed by the function computeQuarterlyFun
function computeSubData(data, subLevelProperty, subLevelList, propertyNames, computeQuarterlyFun)
{
    var subLevelData = [];
    for ( var i = 0; i < subLevelList.length; i++ )
    {
        var tempData = {};
        for ( var j = 0; j < propertyNames.length; j++ )
        {
            tempData[propertyNames[j]] = data[propertyNames[j]].filter( function(d) { return d[subLevelProperty] === subLevelList[i];} );
        }
        subLevelData[i] = computeQuarterlyFun(tempData);
   }
   return subLevelData;
}

// Main function to filter data from files
// data: is an object where the fields specified by the variable fieldNames
// are arrays of data from different files
// propertyNames and propertyValues are arrays specifying what to search 
// in each file. 
// Example: suppose data is of the form, data =  { file1: [{}, {}, ...],
//                                       file2: [{}, {}, ...],
//                                       file3: [{}, {}, ...]}
// Suppose we want to search prop1 == val1 in file1, prop2 == val2 in file2
// and so on ...
// if propertyNames is just one entry, then each array will 
// be filtered for the same property
function filterData(data, fileNames, propertyNames, propertyValues)
{
    // Make everything an array, this handles the case
    // when a single argument is passed
    if ( !Array.isArray(propertyNames) )
    {
        propertyNames = [propertyNames];
    }
    if ( !Array.isArray(propertyValues) )
    {
        propertyValues = [propertyValues];
    }
    if ( !Array.isArray(fileNames) )
    {
        fileNames = [fileNames];
    }

    if ( propertyNames.length != propertyValues.length )
    {
        console.log( "propertyNames and propertyValues should have same length");
    }

    // If propertyName is of length 1, search the same property in entire data
    if ( propertyNames.length === 1 )
    {
        propertyNames = fileNames.map(function(d) { return propertyNames; } );
        propertyValues = fileNames.map(function(d) { return propertyValues; } );
    }

    if ( propertyNames.length != fileNames.length )
    {
        console.log( "propertyNames and fileNames should have same length");
    }

    var filteredData = {};
    for ( var i = 0; i < fileNames.length; i++ )
    {
        filteredData[fileNames[i]] = data[fileNames[i]].filter(function(d) { return d[propertyNames[i]] == propertyValues[i]; } );
    }
    return filteredData;
}
