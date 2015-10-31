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

    // All the fields we need to compute
    // The array sizes are 5 for the 4 quarters and the FY15/16
    data.pipeLineQualified = [0, 0, 0, 0, 0];
    data.pipeLineQualifiedOut = [0, 0, 0, 0, 0];
    data.pipeLineSuccessful = [0, 0, 0, 0, 0];
    data.pipeLineUnsuccessful = [0, 0, 0, 0, 0];
    data.pipeLineInProgress = [0, 0, 0, 0, 0];
    data.contractAwardPerQuarter = [0, 0, 0, 0, 0];
    data.pipeLineTotal = [0, 0, 0, 0, 0];
    data.pipeLineTotalQualified = [0, 0, 0, 0, 0];
    data.percentAgeQualified = [0, 0, 0, 0, 0];
    data.percentAgeSuccessful = [0, 0, 0, 0, 0];
    data.contractAwardPerQuarter = [0, 0, 0, 0, 0];


    data.quarterNames = ["Q1", "Q2", "Q3", "Q4"];
    data.statusStrings = {successful: "successful", unsuccessful: "unsuccessful", inProgress:"in progress", qualifiedOut: "qulified out"};

    // At the moment we only have one quarter
    var numOfQuarters = 4;

    for ( var i = 0; i < numOfQuarters; i++ )
    {
        // Divide the data based on their statuses:
        var statusProperty = dashBoardData.bizDevData.propertyList[14]; 
        var successfulData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.successful; } );
        var unsuccessfulData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.unsuccessful; } );
        var inProgressData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.inProgress; } );
        var qualifiedOutData = pipeLineDataArray.filter( function(d) { return d[statusProperty] == data.statusStrings.qualifiedOut; } );

        // Record each status and Convert to £k
        var valueProperty = dashBoardData.bizDevData.propertyList[3];
        data.pipeLineQualifiedOut[i] = (sumArrayProperty( qualifiedOutData, valueProperty) / 1000.0) || 0.0;
        // TODO: How is this different from the above?
        data.pipeLineQualified[i] = (sumArrayProperty( qualifiedOutData, valueProperty)/1000.0) || 0.0;
        data.pipeLineSuccessful[i] = (sumArrayProperty( successfulData, valueProperty)/1000.0) || 0.0;
        data.pipeLineUnsuccessful[i] = (sumArrayProperty( unsuccessfulData, valueProperty)/1000.0) || 0.0;
        data.pipeLineInProgress[i] = (sumArrayProperty( inProgressData, valueProperty)/1000.0) || 0.0;

        /**********************************************/
        var valueTotalProperty = dashBoardData.bizDevData.contractsPropertyList[2];
        data.contractAwardPerQuarter[i] = sumArrayProperty( contractDataArray, valueTotalProperty)/1000.0 || 0.0;

    }


    // Based on the above computations, calculate other things:
    for ( var i = 0; i < numOfQuarters; i++ )
    {
        data.pipeLineTotalQualified[i]= data.pipeLineQualified[i] +  data.pipeLineQualifiedOut[i];
        data.pipeLineTotal[i] = data.pipeLineSuccessful[i] + data.pipeLineUnsuccessful[i] + data.pipeLineInProgress[i];

        data.percentAgeQualified[i] = (data.pipeLineQualified[i] / data.pipeLineTotalQualified[i] * 100.0) || 0.0;
        data.percentAgeSuccessful[i] = (data.pipeLineSuccessful[i] / data.pipeLineTotal[i] * 100.0) || 0.0;
    }


    // Format numbers accordingly:
    for ( var i = 0; i < data.pipeLineQualified.length; i++ )
    {
        data.pipeLineQualified[i] = dashBoardSettings.numberFormat(data.pipeLineQualified[i]); 
        data.pipeLineQualifiedOut[i] = dashBoardSettings.numberFormat(data.pipeLineQualifiedOut[i]);
        data.pipeLineSuccessful[i] = dashBoardSettings.numberFormat(data.pipeLineSuccessful[i] );
        data.pipeLineUnsuccessful[i] = dashBoardSettings.numberFormat(data.pipeLineUnsuccessful[i] );
        data.pipeLineInProgress[i] = dashBoardSettings.numberFormat(data.pipeLineInProgress[i] );
        data.contractAwardPerQuarter[i] = dashBoardSettings.numberFormat(data.contractAwardPerQuarter[i] );
        data.pipeLineTotal[i] = dashBoardSettings.numberFormat(data.pipeLineTotal[i] );
        data.pipeLineTotalQualified[i] = dashBoardSettings.numberFormat(data.pipeLineTotalQualified[i] );
        data.percentAgeQualified[i] = dashBoardSettings.numberFormat(data.percentAgeQualified[i] );
        data.percentAgeSuccessful[i] = dashBoardSettings.numberFormat(data.percentAgeSuccessful[i] );
        data.contractAwardPerQuarter[i] = dashBoardSettings.numberFormat(data.contractAwardPerQuarter[i] );
    }
    return data;
}

function makeBizDevTableData(data)
{
    var tableHeader = ["Pipeline (£K)", "Q1", "Q2", "Q3", "Q4", "FY"];
    var tableData = [];
    tableData.push(tableHeader);
    
    tableData.push( ["Pipeline - Qualified"].concat(data.pipeLineQualified) );
    tableData.push( ["Pipeline - Qualified Out"].concat(data.pipeLineQualifiedOut) );
    tableData.push( ["Total Qualified"].concat(data.pipeLineTotalQualified) );
    tableData.push( ["% Qualified"].concat(data.percentAgeQualified ) );
    tableData.push( ["Pipeline - Successful"].concat(data.pipeLineSuccessful ) );
    tableData.push( ["Pipeline - Unsuccessful"].concat(data.pipeLineUnsuccessful ) );
    tableData.push( ["Pipeline - In Progress"].concat( data.pipeLineInProgress ) );
    tableData.push( ["Total Pipeline"].concat(data.pipeLineTotal ) );
    tableData.push( ["% Successful"].concat( data.percentAgeSuccessful ) );
    tableData.push( ["Contract Awrad per Quarter"].concat( data.contractAwardPerQuarter ) ); 

    return tableData;
}
