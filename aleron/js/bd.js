// *******************************************************
//    Business Development Utility functions
// *****************************************************//
function computeQuarterlyBizDevData(pipeLineDataArray, contractDataArray)
{
    /*****************************************
     * This function is accessing global data:
     * ****************************************/

    // This is the object returned:
    var data = {};
    data.pipeLineQualified = [];
    data.pipeLineQualifiedOut = [];
    data.pipeLineSuccessful = [];
    data.pipeLineUnsuccessful = [];
    data.pipeLineInProgress = [];
    data.contractAwardPerQuarter = [];

    data.quarterNames = ["Q1", "Q2", "Q3", "Q4"];

    var property = []; 
    
    // At the moment we only have one quarter
    var numOfQuarters = 1;

    for ( var i = 0; i < numOfQuarters; i++ )
    {
        property = dashBoardData.bizDevData.propertyList[2]; 
        data.pipeLineQualified[i] = sumArrayProperty( pipeLineDataArray, property);


        property = dashBoardData.bizDevData.propertyList[3]; 
        data.pipeLineQualifiedOut[i] = sumArrayProperty( pipeLineDataArray, property);

        // TODO: This property is matching out of sheer luck, do it proper:
        property = dashBoardData.bizDevData.propertyList[2]; 
        data.contractAwardPerQuarter[i] = sumArrayProperty( contractDataArray, property);

    }


    data.pipeLineTotal = [];
    data.pipeLineTotalQualified = [];
    data.percentAgeQualified = [];

    data.pipeLineTotalSuccessful = [];
    data.percentAgeSuccessful = [];

    // Based on the above computations, calculate other things:
    for ( var i = 0; i < numOfQuarters; i++ )
    {
        data.pipeLineTotal[i] = data.pipeLineQualified[i] +  data.pipeLineQualifiedOut[i];
        data.pipeLineTotalQualified[i] = data.pipeLineQualified[i];

        // TODO: Handle divide by zero:
        if ( data.pipeLineTotal[i] === 0 )
        {
            data.pipeLineTotal[i] = 1;
        }

        data.percentAgeQualified[i] = data.pipeLineTotalQualified[i] / data.pipeLineTotal[i] * 100.0;
        data.percentAgeSuccessful[i] = data.pipeLineTotalSuccessful[i] / data.pipeLineTotal[i] * 100.0;
    }
    
    return data;
}

function makeBizDevTableData(data)
{
    var tableHeader = ["Pipeline (£)", "Q1", "Q2", "Q3", "Q4", "FY", "FY15/16", "FY14/15"];
    var tableData = [];
    tableData.push(tableHeader);
    
    var propertyName = ["pipeLineQualified", "pipeLineQualifiedOut", "pipeLineTotal ", "percentAgeQualified", "pipeLineSuccessful", "pipeLineUnsuccessful", "pipeLineInProgress", "pipeLineTotalQualified", "percentageSuccessful", "contractAwardPerQuarter" ];

    var firstColumn = ["Pipeline - Qualified", "Pipeline - Qualified Out", "Total Pipeline", "% Qualified", "Pipeline - Successful", "Pipeline - Unsuccessful", "Pipeline - In progress", "Total Qualified Pipeline", "% Successful", "Contract Award per Quarter" ];

    for ( var i = 0; i < propertyName.length; i++ )
    {
        var row = [];
        row.push( firstColumn[i]);

        row = row.concat( data[propertyName[i]]);
        // dummy entries to match the number of columns
        row = row.concat( [0, 0, 0, 0, 0, 0] );
        tableData.push(row);
    }    
    return tableData;
}
