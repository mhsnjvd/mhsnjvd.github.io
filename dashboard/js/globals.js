/////////////////////////////////////////////
//          Global variables               //
/////////////////////////////////////////////

var dashBoardData = {};
dashBoardData.impactData = {};
dashBoardData.financialsData = {};
dashBoardData.bizDevData = {};
dashBoardData.peopleBizModelData = {};
dashBoardData.marketData = {};


dashBoardData.impactData.clickedData = {};
dashBoardData.impactData.currentData = {};

var dashBoardSettings = {};
dashBoardSettings.color = {};
dashBoardSettings.color.income = "orange";
dashBoardSettings.color.forecast = "steelblue";
dashBoardSettings.color.budget = "darkcyan";
dashBoardSettings.color.previousYear = "black";
dashBoardSettings.color.expenditure = "red";
dashBoardSettings.color.histogram = "steelblue";
dashBoardSettings.color.imageBackGround = "none";


dashBoardSettings.color.successful = "green";
dashBoardSettings.color.unsuccessful = "red";
dashBoardSettings.color.pipeLineInProgress = "orange";
dashBoardSettings.color.pipeLineQualifiedOut = "steelblue";

dashBoardSettings.numberFormat = d3.format(",.2f");
dashBoardSettings.stackNumberFormat = d3.format(",.1f");
dashBoardSettings.percentFormat = d3.format(",.2f");
dashBoardSettings.piePercentFormat = d3.format(",.1f");
dashBoardSettings.pieNumberFormat = d3.format(",.0f");

// Path of data directory:
dashBoardSettings.dataDir = "./data/";


// Files needed
// Name of the file and the property name under which it will be stored
dashBoardData.financialsData.files = [ 
                    { name: "010_Finance_201415_FY_CC.csv",   propertyName: "FY1415" }, 
                    { name: "011_a_Finance_201516_P3_CC.csv", propertyName: "P31516" },
                    { name: "011_b_Finance_201516_P6_CC.csv", propertyName: "P61516"} 
                    ];

dashBoardData.peopleBizModelData.files = [
                    { name: "007_CAIU_Internal.csv",   propertyName: "internalData"},
                    { name: "004_b_Staff_Sep15.csv",   propertyName: "staffData" }
                    ];

dashBoardData.impactData.files = [
                    { name: "003_CAIU_External.csv",   propertyName: "externalInspectionsData" },
                    { name: "001_Contract_DB_Q2.csv",  propertyName: "contractsData" }
                    ];

dashBoardData.bizDevData.files = [
                    { name: "009_Pipeline_Contracts.csv",     propertyName: "contractsData"},
                    { name: "008_Pipeline_Opportunities.csv", propertyName: "pipeLineOpportunities"}
];

dashBoardData.marketData.files = [
                    { name: "csDataCymru.csv",     propertyName: "csDataCymru"},
                    { name: "csDataEngland.csv",     propertyName: "csDataEngland"},
                    { name: "csDataNI.csv",     propertyName: "csDataNI"},
                    { name: "csDataScotland.csv",     propertyName: "csDataScotland"},
                    { name: "marketDataUK.csv",     propertyName: "marketDataUK"}
];

// Define heirarchies:
dashBoardData.impactData.hierarchicalProperties = ["Nation", "R/N or BL", "Locality"];
dashBoardData.impactData.nationProperty = dashBoardData.impactData.hierarchicalProperties[0];
dashBoardData.impactData.nationList = ["Business Lines", "Celtic Nations", "England", "Pan Regional", "Other"];
dashBoardData.impactData.regionProperty = dashBoardData.impactData.hierarchicalProperties[1];
dashBoardData.impactData.localityProperty = dashBoardData.impactData.hierarchicalProperties[2];

dashBoardData.financialsData.hierarchicalProperties = ["Nation", "Region", "Locality", "CC"];
dashBoardData.financialsData.nationProperty = dashBoardData.financialsData.hierarchicalProperties[0];
dashBoardData.financialsData.nationList = ["Business Lines", "Celtic Nations", "England", "Pan Regional", "Other"];
dashBoardData.financialsData.regionProperty = dashBoardData.financialsData.hierarchicalProperties[1];
dashBoardData.financialsData.localityProperty = dashBoardData.financialsData.hierarchicalProperties[2];
dashBoardData.financialsData.costCentreProperty = dashBoardData.financialsData.hierarchicalProperties[3];

dashBoardData.peopleBizModelData.hierarchicalProperties = ["Nation", "R/N/BL", "Locality", "CC"];
dashBoardData.peopleBizModelData.nationProperty = dashBoardData.peopleBizModelData.hierarchicalProperties[0];
dashBoardData.peopleBizModelData.nationList = ["Business Lines", "Celtic Nations", "England", "Pan Regional", "Other"];
dashBoardData.peopleBizModelData.regionProperty = dashBoardData.peopleBizModelData.hierarchicalProperties[1];
dashBoardData.peopleBizModelData.localityProperty = dashBoardData.peopleBizModelData.hierarchicalProperties[2];
dashBoardData.peopleBizModelData.costCentreProperty = dashBoardData.peopleBizModelData.hierarchicalProperties[3];

dashBoardData.bizDevData.hierarchicalProperties = ["Nation", "Region", "Locality"];
dashBoardData.bizDevData.nationProperty = dashBoardData.bizDevData.hierarchicalProperties[0];
dashBoardData.bizDevData.nationList = ["Business Lines", "Celtic Nations", "England", "Pan Regional", "Other"];
dashBoardData.bizDevData.regionProperty = dashBoardData.bizDevData.hierarchicalProperties[1];
dashBoardData.bizDevData.localityProperty = dashBoardData.bizDevData.hierarchicalProperties[2];


dashBoardData.marketData.hierarchicalProperties = ["Nation", "Region", "Locality"];
dashBoardData.marketData.nationProperty = dashBoardData.marketData.hierarchicalProperties[0];
dashBoardData.marketData.nationList = ["Business Lines", "Celtic Nations", "England", "Pan Regional", "Other"];
dashBoardData.marketData.regionProperty = dashBoardData.marketData.hierarchicalProperties[1];
dashBoardData.marketData.localityProperty = dashBoardData.marketData.hierarchicalProperties[2];

/***************************************************
/***************************************************
 *  Definitions for Regions and Nations
 *  ***********************************************/
/**************************************************/

dashBoardData.nationPropertyName = "Nation";
// String for selecting all of UK:
dashBoardData.allUKString = "All of UK";
dashBoardData.nationDefinitions = {
                                   "Business Lines": ["Employment Training & Skills", "Family Placement"],
                                   "Celtic Nations": ["Cymru", "Northern Ireland", "Scotland"],
                                   "England": ["East", "London", "Midlands & South West", "South East & Anglia", "West"],
                                   "Pan Regional": ["Pan Regional"],
                                   "Other": ["#NA", "", "N/A", undefined]
                                  };

// A list of all the nations
dashBoardData.nationList = Object.getOwnPropertyNames(dashBoardData.nationDefinitions);

// A list of all the regions:
dashBoardData.regionList = [];
dashBoardData.nationList.forEach( function(nation) { 
    dashBoardData.regionList = dashBoardData.regionList.concat( dashBoardData.nationDefinitions[nation] ) } );

// Create an object with the format: { region: nation, region: nation, ...}
dashBoardData.regionToNation = {};
dashBoardData.regionList.forEach( function(region)
        {
            var nations = dashBoardData.nationList;
            for ( var i = 0; i < nations.length; i++ )
            {
                if ( dashBoardData.nationDefinitions[nations[i]].indexOf(region) !== -1 )
                {
                    dashBoardData.regionToNation[region] = nations[i];
                }
            }
        });

function addNationProperty(data, regionProperty, nationProperty)
{
    for ( var i = 0; i < data.length; i++ )
    {
        data[i][nationProperty]= dashBoardData.regionToNation[data[i][regionProperty]];
    }
}





dashBoardSettings.colors = {};
dashBoardSettings.colors.greenString = "rgb(0, 150, 0)";
// Function for defining colors for RAG
//
dashBoardSettings.ragColors = function (d)
{
    if ( d == 0 )
        // Red
       return "rgb(255, 0, 0)";
    if ( d == 1 )
        // Amber
       return "rgb(255, 153, 0)";
       //return "#FF9900"
    if ( d == 2 )
        // Green
       return dashBoardSettings.colors.greenString;
    if ( d ==  3)
        // Grey
       return "rgb(128, 128, 128)";

}

dashBoardSettings.goodBadColors = function (d)
{
    if ( d == 0 )
        // Red if bad i.e 0
       return "rgb(255, 0, 0)";
    if ( d == 1 )
        // Green if good i.e. 1
       return dashBoardSettings.colors.greenString;
}

dashBoardSettings.extInspectionsColors = function (i)
{
    /*
    Properties for colors:
    ["Performance Unscored", "Unsatisfactory", "Satisfactory/Requires Improvement", "Good/Very Good", "Outstanding"];
    */

    if ( i == 0 )
    {
        // Grey
        return "rgb(128, 128, 128)";
    }

    if ( i == 1 )
    {
        // Red 
       return "rgb(255, 0, 0)";
    }

    if ( i == 2 )
    {
        // Amber
       return "rgb(255, 153, 0)";
    }

    if ( i == 3 )
    {
        // Green
        return dashBoardSettings.colors.greenString;
    }

    if ( i == 4 )
    {
        // Greeeeeeeen
        return "rgb(0, 255, 0)";
    }

    // Otherwise tell what happened:
    console.log("Could not resolve color from index");
}

dashBoardData.impactData.impactColorToImpactProperty = function (d)
{
    if ( d == "rgb(255, 0, 0)" )
    {
        return "R";
    }
    else
    {
        if ( d == "rgb(255, 153, 0)" )
        {
            return "A";
        }
        else
        {
            if ( d == dashBoardSettings.colors.greenString )
            {
                return "G";
            }
            else
            {
                console.log("color: " + d + " not recognized");
            }
        }
    }
}

dashBoardData.bizDevData.bizDevColorToBizDevProperty = function (d)
{
    var propertyName = ["", "", "", ""];
    if ( d == "rgb(255, 0, 0)" )
    {
        return "unsuccessful";
    }
    else
    {
        if ( d == "rgb(255, 153, 0)" )
        {
            return "in progress";
        }
        else
        {
            if ( d == dashBoardSettings.colors.greenString )
            {
                return "successful";
            }
            else
            {
                if ( d == "rgb(128, 128, 128)" )
                {
                    return "qualified out";
                }
                else
                {
                    console.log("color: " + d + " not recognized");
                }
            }
        }
    }
}
