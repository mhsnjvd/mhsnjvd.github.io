/////////////////////////////////////////////
//          Global variables               //
/////////////////////////////////////////////

var dashBoardData = {};
dashBoardData.financialsData = {};
dashBoardData.contractsData = {}; 

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
dashBoardSettings.color.actual = "orange";
dashBoardSettings.color.forecast = "steelblue";
dashBoardSettings.color.budget = "red";
dashBoardSettings.color.previous = "green";
dashBoardSettings.color.histogram = "steelblue";
dashBoardSettings.numberFormat = d3.format(",.2f");
