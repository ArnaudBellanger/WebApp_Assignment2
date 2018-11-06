// Declaration of global variable
var myData;
var listBornCountry;

// on load parse the json file into the global var myData
window.onload = function() {
    
    var nobelRequest = new XMLHttpRequest();
    
    
    nobelRequest.onreadystatechange = function nobelRequestData(){
        if (nobelRequest.readyState == 4 && nobelRequest.status == 200) {
            myData = JSON.parse(nobelRequest.responseText);
            displayCategory();
            displayBornCountry();
        }
    };
    nobelRequest.open('GET','json.json');
    nobelRequest.send();
};

// return the unique category in one array https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
// output used to fill the html form
function getCategory (obj1) {
    var array = obj1.laureates;
    var flags = [], output = [], l = array.length, i;
    for( i=0; i<l; i++) {
        if( flags[array[i].prizes[0].category]) continue;
        flags[array[i].prizes[0].category] = true;
        output.push(array[i].prizes[0].category);
    }
    return output
};

// display the select menue for the category
// take the output from getCategory() to integrate the output into the html
function displayCategory (){
    var category = getCategory(myData);
    var i;
    var text = "<option value=\"\">   </option>";
    for (i = 0; i < (category.length-1); i++) { 
        text += "<option value=\""+category[i]+"\">"+category[i]+"</option>";
    } 
    document.getElementById("category").innerHTML =text;
};

//return unique bornCountry and bornCountryCode
// same as getCategory()
function getbornCountry (obj1) {
    var array = obj1.laureates;
    var flags = [], output = [], l = array.length, i;
    for( i=0; i<l; i++) {
        if( flags[array[i].bornCountry]) continue;
        flags[array[i].bornCountry] = true;
        output.push(array[i].bornCountry);
    }
    for( i=0; i<l; i++) {
        if( flags[array[i].bornCountryCode]) continue;
        flags[array[i].bornCountryCode] = true;
        output.push(array[i].bornCountryCode);
    }
    return output
    
};
// same as displayCategory() 
function displayBornCountry (){
    var listBornCountry = getbornCountry(myData);
    var i;
    var text = "<option value=\"\">";
    for (i = 0; i < (listBornCountry.length); i++) { 
        text += "<option value=\""+listBornCountry[i]+"\">";
    } 
    document.getElementById("countries").innerHTML =text;
};


//  call the function getInputVal to get all the value from the HTML form into a dictionary
function getParameter(){ 
    // Get values
    var startDate = getInputVal('startDate');
    var endDate = getInputVal('endDate');
    var category = getInputVal('category');
    var Country = getInputVal('idCountry');
    // Clear form
    //   document.getElementById('parameter').reset();
    return {
        startDate: startDate,
        endDate: endDate,
        category: category,
        Country: Country
    };
};

// get the value from the html form
function getInputVal(id){
    return document.getElementById(id).value;
};

//  main function that display le laureates
function indexData(obj1){
    // transform myData.laureates into obj for easy use
    var obj = obj1.laureates;

    // parameter is a dictionary containing all the information from the form
    var parameter = getParameter();

    // nobelSelected is the main variable that display the table with all the nobel inside
    var nobelSelected = "<table><caption>caption</caption><tr class=\"head\"><th>Name</th><th>Category</th><th>year awarded</th><th>more</th></tr>";

    // access all the value from the form (I should have done something easier but it's too late now)
    var category = parameter.category;
    var bornCountryCode = parameter.Country;
    var startDate = parameter.startDate;
    var endDate = parameter.endDate;
    
    if (endDate<startDate){
        endDate=startDate;
        document.getElementById("endDate").value=startDate;
    };
    
    // iterate through all the element of the object
    for (i=0; i < obj.length; i++){
        
        // select only the laureates that win during the date interval selected
        if (obj[i].prizes[0].year >= startDate && obj[i].prizes[0].year <= endDate ){
            
            // select the category selected by the user or all if the user put nothing in the form category
            if ((obj[i].prizes[0].category.toUpperCase() == category.toUpperCase()) || (category == "") ) {
                
                // compare the contry code or the country of the object to what the user entered in the form
                if ((obj[i].bornCountryCode == bornCountryCode.toUpperCase()) || (bornCountryCode == "" || obj[i].bornCountry == bornCountryCode ) ) {

                    // depending if the laureate is a male or female I do not five the same ID to the table row
                    // also the last cell of the table contain a button that onclick call a function with argument laureate[i].id
                    if (obj[i].gender == "male"){
                    
                    nobelSelected += "<tr class =\"male gender\"><td>"+ obj[i].firstname +" "+ obj[i].surname + "</td><td>" + obj[i].prizes[0].category +"</td><td>" + obj[i].prizes[0].year +"</td><td>" + "<button class=\"moreInfo\"  onclick=\"findID("+obj[i].id+")\">more</button></td></tr>"

                    };
                    if (obj[i].gender == "female"){
                    
                        nobelSelected += "<tr class =\"female gender\"><td>"+ obj[i].firstname +" "+ obj[i].surname + "</td><td>" + obj[i].prizes[0].category +"</td><td>" + obj[i].prizes[0].year +"</td><td>" + "<button class=\"moreInfo\"  onclick=\"findID("+obj[i].id+")\">more</button></td></tr>"
    
                        };

                };
            };
            
        };
    };
    nobelSelected += "</table>";

    // display the table
    document.getElementById("id01").innerHTML = nobelSelected;

    // display the form to choose which gender the user whant to see
    var genderForm = "<form class=\"gender\"><input type=\"radio\" name=\"gender\" onclick=\"displayOnly(\'male\')\"><span>female</span><input type=\"radio\" name=\"gender\" onclick=\"displayOnly(\'female\')\" ><span>male</span><input type=\"radio\" name=\"gender\" onclick=\"displayOnly(\'both\')\"><span>both</span></form>";

    document.getElementById("genderForm").innerHTML = genderForm;
    
};

// display only male or female
function displayOnly(gender){
    // need to display everything first because it'll keep the diplay none from a previous ussage
    var allGender = document.getElementsByClassName("gender");
    for (var i = 0;i < allGender.length; i++){
        allGender[i].style.display = 'table-row';
        };

        // I could have done a simplier funtion as well here but I'm out of time now as well
        // the function hide the table row of the table whith countain the gender the user don't want to see
    if(gender != 'both'){
        console.log(gender);
        var arrayGender = document.getElementsByClassName(gender);
        for (var i = 0;i < arrayGender.length; i++){
        arrayGender[i].style.display = 'none';
        };
    };
};


// this function is trigerred by the function bellow findID
// create a div element and then display it to the web page.
function giveMoreInfo(ID){
    var obj = myData.laureates;

    
    var moreInfoElem = "<div id=\"simpleModal\" class=\"modal\"><div class=\"modal-content\"><div class=\"modal-header\"><span class=\"closeBtn\" onclick=\"closeModal()\">&times;</span><h2>More about "+ obj[ID].firstname + " " + obj[ID].surname + " </h2></div><div class=\"modal-body\"><div class=\"modal-body-left\">  <ul><li>Was born in " + getYear(obj[ID].born) +" in "+ obj[ID].bornCity + "</li><li>Died in " + getYear(obj[ID].died) + "</li></ul></div><div class=\"modal-body-right\"><p>The motivation for this price were :</p><p>" + obj[ID].prizes[0].motivation + "</p><p>The affiliation of this prize is with" + obj[ID].prizes[0].affiliations[0].name + " in " + obj[ID].prizes[0].affiliations[0].namecity + ", " + obj[ID].prizes[0].affiliations[0].country + "</p></div></div><div class=\"modal-footer\"><h3>What a great discovery</h3></div></div></div>";

    // did't find an easy way to append html element to my html with javascript thus the jquery 
    $('#mainWrapper').append(moreInfoElem);
};

// this function is trigered by the button at the end of each table row 
// it take the id of a laureate and return which place it is in the object (.laureate[i])
function findID (ID){
    var obj = myData.laureates;
    for (var i=0; i < obj.length; i++){
        if (ID == obj[i].id){
            giveMoreInfo(i);
            break;
        }
    };
}

//verify that the date asked is viable and return anly the year coresponding or not relevant
// I should hade done similar function to check afiliation but didn't had the time sorry
function getYear(date){
    if (date == "0000-00-00") {
        return " not relevent for this person."
    } else {
    return date.substr(0,4)}
};

// Function to close the div ellement that I created to display more information about the laureate
function closeModal(){
    console.log("close btn");
    var modal = document.getElementById('simpleModal');
    var parent = document.getElementById('mainWrapper');
    parent.removeChild(modal);

};
