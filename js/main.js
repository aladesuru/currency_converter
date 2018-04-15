var leftInput = document.getElementById("leftInput");
var rightInput = document.getElementById("rightInput");
var leftBoxPerRate = document.getElementById("leftBoxPerRate");
var rightBoxPerRate = document.getElementById("rightBoxPerRate");
var leftSelectBox = document.getElementById("leftSelectBox");
var rightSelectBox = document.getElementById("rightSelectBox");
var leftPerRate = 0;
var rightPerRate = 0;

// cross browser event Handler

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

// Loading daily exchange rate using AJAX

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

//populate the select box option tag value with the rate and text with country

         leftSelectBox = document.getElementById("leftSelectBox");
         rightSelectBox = document.getElementById("rightSelectBox");
       
        var optionItem = "";
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
    }

  }
};

dailyExchangeRate.open("GET" , "eurofxref-daily.xml");
dailyExchangeRate.send();

}catch(ex){
  container.style.opacity = 1
  container.innerHTML = '<div class="alert"> Please try again later </div>';
}


	


//  A user can input a value on the left box and the 
//  value will be automatically converted to the appropriate currency value on the right
//  Or a user can input a value on the right and will 
//automatically be converted to the other currency on the left



// Helper functions

function crossRate(selectedRate , toRate)
{

  var result = 1 / (selectedRate.value);
  result = result * (toRate.value);
  result = result.toFixed(4);
  // var PerRate = "1 " + selectedRate.options[selectedRate.selectedIndex].text + " = " +
  //                 result + " " + toRate.options[toRate.selectedIndex].text ;

  return result;
}

function convertedAmout(currencyFrom , toCurrency) {

   var amount = toCurrency / currencyFrom ;
    amount = amount.toFixed(2);
    return amount;   
}

function selectBoxOnchange(event) {
     event = eventUtilites.getEvent(event);
     target = eventUtilites.getTarget(event);

     if(event.target.tagName.toLowerCase() == "select"){

      if (event.target.id === "leftSelectBox") {

           leftPerRate = crossRate(leftSelectBox , rightSelectBox);
           leftBoxPerRate.innerHTML = "1 " + leftSelectBox.options[leftSelectBox.selectedIndex].text + " = " +
                  leftPerRate + " " + rightSelectBox.options[rightSelectBox.selectedIndex].text ;


          rightPerRate = crossRate(rightSelectBox , leftSelectBox);
          rightBoxPerRate.innerHTML = "1 " + rightSelectBox.options[rightSelectBox.selectedIndex].text + " = " +
                  rightPerRate + " " + leftSelectBox.options[leftSelectBox.selectedIndex].text ;  
      }

      if (event.target.id === "rightSelectBox") {

          rightPerRate = crossRate(rightSelectBox , leftSelectBox);
          rightBoxPerRate.innerHTML = "1 " + rightSelectBox.options[rightSelectBox.selectedIndex].text + " = " +
                  rightPerRate + " " + leftSelectBox.options[leftSelectBox.selectedIndex].text ;


          leftPerRate = crossRate(leftSelectBox , rightSelectBox);
           leftBoxPerRate.innerHTML = "1 " + leftSelectBox.options[leftSelectBox.selectedIndex].text + " = " +
                  leftPerRate + " " + rightSelectBox.options[rightSelectBox.selectedIndex].text ;
      }    
  }

}


//when select box is click or value is selected display the currency per rate 

eventUtilites.addEventHandler(leftSelectBox , "click" , selectBoxOnchange);
eventUtilites.addEventHandler(leftSelectBox , "change" , selectBoxOnchange);

eventUtilites.addEventHandler(rightSelectBox , "click" , selectBoxOnchange);
eventUtilites.addEventHandler(rightSelectBox , "change" , selectBoxOnchange);


//when input value change or key is release calculate 
function inputOnchange(event) {

    event = eventUtilites.getEvent(event);
    target = eventUtilites.getTarget(event);
    var isNum = /[0-9]/;

  if (event.target.id === "leftInput") {
     if (rightPerRate) {
      if (isNum.test(leftInput.value) && leftInput.value !== 0){

          var rightAmount = leftInput.value / rightPerRate;
          rightInput.value = rightAmount.toFixed(2);

      }else{

        rightInput.value = "";
      } 
  }

  } else {
    if (leftPerRate) {
      if (event.target.id === "rightInput" && isNum.test(rightInput.value) && rightInput.value !== 0){

          var leftAmount = rightInput.value / leftPerRate;
          leftInput.value = leftAmount.toFixed(2);

      }else{

        leftInput.value = "";
      } 
  }

  }




 
  


}

// leftInput.onchange = inputOnchange ;
eventUtilites.addEventHandler(leftInput , "keypress" , inputOnchange);
eventUtilites.addEventHandler(leftInput , "keyup" , inputOnchange);

eventUtilites.addEventHandler(rightInput , "keypress" , inputOnchange);
eventUtilites.addEventHandler(rightInput , "keyup" , inputOnchange);


