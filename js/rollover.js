// JavaScript Document
  <!-- hide from non JavaScript Browsers

  Rollimage = new Array()

  Rollimage[0]= new Image(45,50)
  Rollimage[0].src = "../images/green_aito1.jpg"

  Rollimage[1] = new Image(45,50)
  Rollimage[1].src = "../images/green_aito1_over.jpg"

  Rollimage[2]= new Image(90,50)
  Rollimage[2].src = "../images/ukinbound.jpg"

  Rollimage[3] = new Image(90,50)
  Rollimage[3].src = "../images/ukinbound_over.jpg"
  
  Rollimage[4]= new Image(214,50)
  Rollimage[4].src = "../images/travelwhiz.jpg"

  Rollimage[5] = new Image(214,50)
  Rollimage[5].src = "../images/travelwhiz_logo_over.jpg"
  
  Rollimage[6]= new Image(214,50)
  Rollimage[6].src = "../images/travelprint.jpg"

  Rollimage[7] = new Image(214,50)
  Rollimage[7].src = "../images/travelprint_logo_over.jpg"
  function SwapOut(){
    document.aito.src = Rollimage[1].src;
    return true;
  }

  function SwapBack(){
    document.aito.src = Rollimage[0].src; 
    return true;
  }
  
  function SwapOut_uk(){
    document.uk.src = Rollimage[3].src;
    return true;
  }

  function SwapBack_uk(){
    document.uk.src = Rollimage[2].src; 
    return true;
  }
  
  function SwapOut_travelwhiz(){
    document.jdi.src = Rollimage[5].src;
    return true;
  }

  function SwapBack_travelwhiz(){
    document.jdi.src = Rollimage[4].src; 
    return true;
  }
  
  function SwapOut_travelprint(){
    document.travelprint.src = Rollimage[7].src;
    return true;
  }

  function SwapBack_travelprint(){
    document.travelprint.src = Rollimage[6].src; 
    return true;
  }

// - stop hiding          --> 