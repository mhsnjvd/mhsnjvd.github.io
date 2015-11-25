/////////////////////////////////////////////
//          Global variables               //
/////////////////////////////////////////////

var dashBoardData = {};
dashBoardData.impactData = {};
dashBoardData.financialsData = {};
dashBoardData.bizDevData = {};
dashBoardData.peopleBizModelData = {};

// These can be created on the runtime but
// given here just to give a template idea:
dashBoardData.financialsData.rawData = [];
dashBoardData.financialsData.funderList = [];
dashBoardData.financialsData.regionList = [];
dashBoardData.financialsData.localityList = [];
dashBoardData.financialsData.costCentreList = [];
dashBoardData.financialsData.propertyList = [];
dashBoardData.financialsData.currentRegionData = [];
dashBoardData.financialsData.currentFunderData = [];
dashBoardData.financialsData.currentLocalityData = [];
dashBoardData.financialsData.currentCostCentreData = [];

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
dashBoardSettings.pieNumberFormat = d3.format(",.1f");

// Path of data directory:
dashBoardSettings.dataDir = "./data/";


// Files needed
dashBoardData.financialsData.files = [ 
                    { name: "010_Finance_201415_FY_CC.csv",   propertyName: "FY1415" }, 
                    { name: "011_a_Finance_201516_P3_CC.csv", propertyName: "P31516" },
                    { name: "011_b_Finance_201516_P6_CC.csv", propertyName: "P61516"} 
                    ];

// Names of the properties that must be the header of the columns
// across all financial files
dashBoardData.financialsData.regionProperty = "R/N/BL";
dashBoardData.financialsData.localityProperty = "Locality";
dashBoardData.financialsData.costCentreProperty = "CC";


dashBoardData.peopleBizModelData.files = [
                    { name: "007_CAIU_Internal.csv",   propertyName: "internalData"},
                    { name: "004_b_Staff_Sep15.csv",   propertyName: "rawData" }
                    ];


dashBoardData.impactData.files = [
                    { name: "003_CAIU_External.csv",   propertyName: "externalInspectionsData" }
                    ];




// String for selecting all of UK:
dashBoardData.allUKString = "All of UK";
