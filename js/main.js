/* ==========================================================================
    Global variable declearation
   ========================================================================== */
var leftInput = document.getElementById("leftInput");
var rightInput = document.getElementById("rightInput");
var leftBoxPerRate = document.getElementById("leftBoxPerRate");
var rightBoxPerRate = document.getElementById("rightBoxPerRate");
var leftSelectBox = document.getElementById("leftSelectBox");
var rightSelectBox = document.getElementById("rightSelectBox");
var leftPerRate = 0;
var rightPerRate = 0;


/* ==========================================================================
   cross browser event handler utilites 
   ========================================================================== */
var eventUtilites = {
    addEventHandler: function(element , type , handler)
    {
        if (element.AddEventListener ){
            element.addEventListener(typ , handler , false);
        }else if (element.attachEvent)
        {
          element.attachEvent("on" + type , handler);
        }else {
          element["on" + type] = handler ;
        }
    },

    getEvent: function(event){
      return event ? event : window.event;
    },

    getTarget: function(even){
      return event.target || event.srcElement ;
    }
}

/* ==========================================================================
   Load daily exchange rate using AJAX
   ========================================================================== */
var container = document.getElementById("container");
var dailyExchangeRate = new XMLHttpRequest();
try{
  dailyExchangeRate.onreadystatechange = function () {
  if (dailyExchangeRate.readyState === 4) {

    if (dailyExchangeRate.status === 200) {
        var convertXMLToDom = new DOMParser();
        var XMLDonContent  = convertXMLToDom.parseFromString(dailyExchangeRate.responseText , "text/xml");
        var cubeContainerElement = XMLDonContent.documentElement.getElementsByTagName('Cube')[1];
        var items = cubeContainerElement.getElementsByTagName("Cube");

//populate the select box option tag value with the rate from XML file and ,
// option tag text with country value from XML file
       
        var optionItem = "<option>Select Currency</option>";
        for (var i = 0; i <= items.length - 1; i++) {
          
             var rate =  items[i].getAttribute('rate');
             var currency = items[i].getAttribute('currency');

             optionItem += '<option' ;
             optionItem += ' value=';
             optionItem +=  rate + ">" ;
             optionItem +=  currency ;
             optionItem += '</option>' ;                      
        }

        leftSelectBox.innerHTML =  optionItem ;
        rightSelectBox.innerHTML =  optionItem ; 
        container.style.opacity = 1 ; 
        container.style.transform = "scale(1)";
    }

  }
};

dailyExchangeRate.open("GET" , "eurofxref-daily.xml");
dailyExchangeRate.send();

}catch(ex){
  container.style.opacity = 1
  container.style.opacity = 1 ; 
  container.innerHTML = '<div class="alert"> Please try again later </div>';
}

/* ==========================================================================
   Helper functions use in calculating exchange rate between countries
   ========================================================================== */
function crossRate(selectedRate , toRate)
{
    var result = 1 / (selectedRate.value);
    result = result * (toRate.value);
    result = result.toFixed(4);
    return result;  
}

/* ==========================================================================
   user can select currencies to convert from and to using select box and 
   display the currency per rate at the top of the select box.
   either of the select box dynamically display per rate of the other select box
   ========================================================================== */
function selectBoxOnchange(event) {
     event = eventUtilites.getEvent(event);
     target = eventUtilites.getTarget(event);

      if (event.target.id === "leftSelectBox") {
          if (leftSelectBox.value !== "Select Currency" && rightSelectBox.value !== "Select Currency") {
             leftPerRate = crossRate(leftSelectBox , rightSelectBox);

           leftBoxPerRate.innerHTML = "1 " + leftSelectBox.options[leftSelectBox.selectedIndex].text + " = " +
                  leftPerRate + " " + rightSelectBox.options[rightSelectBox.selectedIndex].text ;


          rightPerRate = crossRate(rightSelectBox , leftSelectBox);
          rightBoxPerRate.innerHTML = "1 " + rightSelectBox.options[rightSelectBox.selectedIndex].text + " = " +
                  rightPerRate + " " + leftSelectBox.options[leftSelectBox.selectedIndex].text ;  

          } else {
            rightBoxPerRate.innerHTML = "";
          }   
           
      }

      if (event.target.id === "rightSelectBox") {
         if (rightSelectBox.value !== "Select Currency" && leftSelectBox.value !== "Select Currency") {
            rightPerRate = crossRate(rightSelectBox , leftSelectBox);
            rightBoxPerRate.innerHTML = "1 " + rightSelectBox.options[rightSelectBox.selectedIndex].text + " = " +
                    rightPerRate + " " + leftSelectBox.options[leftSelectBox.selectedIndex].text ;


            leftPerRate = crossRate(leftSelectBox , rightSelectBox);
             leftBoxPerRate.innerHTML = "1 " + leftSelectBox.options[leftSelectBox.selectedIndex].text + " = " +
                    leftPerRate + " " + rightSelectBox.options[rightSelectBox.selectedIndex].text ;
         } else {
             rightBoxPerRate.innerHTML = "";
         }

          
      }    
}

eventUtilites.addEventHandler(leftSelectBox , "click" , selectBoxOnchange);
eventUtilites.addEventHandler(leftSelectBox , "change" , selectBoxOnchange);
eventUtilites.addEventHandler(rightSelectBox , "click" , selectBoxOnchange);
eventUtilites.addEventHandler(rightSelectBox , "change" , selectBoxOnchange);


/* ==========================================================================
   when a user input a value on the left box the value will be automatically 
   converted to the appropriate currency value on the right
   Or 
   when a user input a value on the right box the value will be automatically 
   converted to the other currency on the left
   ========================================================================== */
function inputOnchange(event) {
    event = eventUtilites.getEvent(event);
    target = eventUtilites.getTarget(event);
    var isNum = /[0-9]/; // set pattern to match input value with to make sure only number 

// checking each element of input to perform right calculation 

  if (event.target.id === "leftInput") {  
     if (rightPerRate) {
      if (isNum.test(leftInput.value) && leftInput.value !== 0){ 

          var rightAmount = leftInput.value / rightPerRate;
          if(!isNaN(rightAmount)){                    // check if the operation fail as a result invalid input
            rightInput.value = rightAmount.toFixed(2) 
          }else{ rightInput.value = "" }
          

      }else{

        rightInput.value = "";
      } 
  }

  } else {
    if (leftPerRate) {
      if (event.target.id === "rightInput" && isNum.test(rightInput.value) && rightInput.value !== 0){

          var leftAmount = rightInput.value / leftPerRate;
          if(!isNaN(leftAmount)){                     // check if the operation fail as a result invalid input
            leftInput.value = leftAmount.toFixed(2) 
          }else{ leftInput.value  = "" }

      }else{

        leftInput.value = "";
      } 
  }

  }

}

eventUtilites.addEventHandler(leftInput , "keypress" , inputOnchange);
eventUtilites.addEventHandler(leftInput , "keyup" , inputOnchange);
eventUtilites.addEventHandler(rightInput , "keypress" , inputOnchange);
eventUtilites.addEventHandler(rightInput , "keyup" , inputOnchange);


