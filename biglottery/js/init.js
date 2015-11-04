// **************************************************
// Initialisations for financials
// **************************************************
//
// Read all the files needed for financials:

// Read file 0:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.financialsData.files[0].name;
     var propertyName = dashBoardData.financialsData.files[0].propertyName;
     
     dashBoardData.financialsData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.financialsData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.financialsData[propertyName].length );
     }); // end of d3.csv()                                
 })();

// read File 1:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.financialsData.files[1].name;
     var propertyName = dashBoardData.financialsData.files[1].propertyName;
     
     dashBoardData.financialsData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.financialsData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.financialsData[propertyName].length );
     }); // end of d3.csv()                                
 })();

// Read file 2:
(function() 
{                                                                                                                               
     var dataFileName = dashBoardData.financialsData.files[2].name;
     var propertyName = dashBoardData.financialsData.files[2].propertyName;
     
     dashBoardData.financialsData[propertyName] = [];
     var fileName = dashBoardSettings.dataDir +  dataFileName;
     console.log("reading:" + fileName);
     d3.csv( fileName, function(d)
     { 
            // Copy the data read into the global variable:
            dashBoardData.financialsData[propertyName] = d;
            console.log(fileName + " read successfully.");
            console.log( dashBoardData.financialsData[propertyName].length );
     }); // end of d3.csv()                                
 })();

// TODO: The following doesn't work, investigate why???????
/*
(function() 
{                                                                                                                               
     var dataFileName = ["010_Finance_201415_FY_CC.csv", "011_a_Finance_201516_P3_CC.csv", "011_b_Finance_201516_P6_CC.csv"];
     var propertyName = [ "FY1415", "P31516", "P61516"];
     console.log("entering grand daddy function");
     
     for( var i = 0; i < 3; i++ )
     {
        var fileName = dashBoardSettings.dataDir +  dataFileName[i];
        d3.csv( fileName, function(d)
        { 
               // Copy the data read into the global variable:
               console.log(fileName);
               dashBoardData.financialsData[propertyName[i]] = d;
               console.log("file " + fileName + " read successfully.");
               console.log( dashBoardData.financialsData[propertyName[i]].length );
        }); // end of d3.csv()                                
     }
     console.log("leaving grand daddy function");
 })();
 */
