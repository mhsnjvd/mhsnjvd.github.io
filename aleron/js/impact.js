// *******************************************************
//    Impact Measurement Utility Functions
// *****************************************************//
function computeQuarterlyImpactData(impactDataArray)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/
    // Generic routine to compute quarterly data.     

    // This is the object returned:
    var data = {};

    var headerColumn = ["Green", "Amber", "Red", "Total Number of Contracts", "Green (Outcomes)", "Amber (Outcomes)", "Red (Outcomes)", "Percentage %", "#CYP WS work with intensively", "#CYP WS work with", "Outstanding", "Good/Very Good", "Satisfactory/Requires Improvement", "Unsatisfactory", "Unscored", "Total"];
    var headerRow = ["Q1", "Q2", "Q3", "Q4", "FY"];

    for ( var i = 0; i < headerColumn.length; i++ )
    {
        data[headerColumn[i]] = {};
        for ( var j = 0; j < headerRow.length; j++ )
        {
            data[headerColumn[i]][headerRow[j]] = 0.0;
            // var property = dashBoardData.impactData.propertyList[2]; 
            // TODO: How to have a list of functions to compute for each quantity?
            //var computedQuantity = sumArrayProperty( impactDataArray, property);

            /*
            var computedQuantity = 0.0;
            // This is just the head count:
            computedQuantity = impactDataArray.length;

            // Full time Equivalent
            var property = dashBoardData.impactData.propertyList[12];
            computedQuantity = sumArrayProperty( impactDataArray, property);
            data[headerColumn[i]][headerRow[j]] = computedQuantity;
            */
        }
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
    var tableHeadings = ["Overall Contract Performance", "Outcomes/ Quality Performance", "Contracts with Beneficiary Feedback", "Number of CYP", "External Inspections"];
    for ( var i = 0; i < tableHeadings.length; i++ )
    {
        var thisHeader = [tableHeadings[i]];
        tableHeaders[i] = thisHeader.concat(topRow);
    }

    // Number of properties in each subtable
    var propertyCount = [4, 3, 1, 2, 6]; 
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

    // Indices of rows to be made bold:
    return tableData;
}



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
    var headerIndices = [0, 6, 11, 14, 18, M-1];

    // Make All the rows
    for ( var i = 0; i < M; i++ )
    {    
        var row;
        row = table.insertRow(i);
        for ( var j = 0; j < N; j++ )
        {
            var cell = row.insertCell(j);   
            cell.innerHTML = tableData[i][j];
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

    return table;    
}
