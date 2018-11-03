

var myData;
var listBornCountry;


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
function displayBornCountry (){
    var listBornCountry = getbornCountry(myData);
    var i;
    var text = "<option value=\"\">";
    for (i = 0; i < (listBornCountry.length); i++) { 
        text += "<option value=\""+listBornCountry[i]+"\">";
    } 
    document.getElementById("countries").innerHTML =text;
};


// get the value fot displaying the corect information
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

// get the value of id
function getInputVal(id){
    return document.getElementById(id).value;
};

function indexData(obj1){
    var obj = obj1.laureates;
    var parameter = getParameter();
    var nobelSelected = "<table><caption>caption</caption><tr class=\"head\"><th>nane</th><th>Category</th><th>year awarded</th><th>more</th></tr>";
    var category = parameter.category;
    var bornCountryCode = parameter.Country;
    var startDate = parameter.startDate;
    var endDate = parameter.endDate;
    
    if (endDate<startDate){
        endDate=startDate;
        document.getElementById("endDate").value=startDate;
    };
    
    for (i=0; i < obj.length; i++){
        
        if (obj[i].prizes[0].year >= startDate && obj[i].prizes[0].year <= endDate ){
            
            if ((obj[i].prizes[0].category.toUpperCase() == category.toUpperCase()) || (category == "") ) {
                
                if ((obj[i].bornCountryCode == bornCountryCode.toUpperCase()) || (bornCountryCode == "" || obj[i].bornCountry == bornCountryCode ) ) {

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

    // display the form to display which gender
    var genderForm = "<form class=\"gender\"><input type=\"radio\" name=\"gender\" onclick=\"displayOnly(\'male\')\"><span>female</span><input type=\"radio\" name=\"gender\" onclick=\"displayOnly(\'female\')\" ><span>male</span><input type=\"radio\" name=\"gender\" onclick=\"displayOnly(\'both\')\"><span>both</span></form>";

    document.getElementById("genderForm").innerHTML = genderForm;
    
};

// display only male or female
function displayOnly(gender){
    // need to display everything first because it'll keep the siplay none from a previous ussage
    var allGender = document.getElementsByClassName("gender");
    for (var i = 0;i < allGender.length; i++){
        allGender[i].style.display = 'table-row';
        };

    if(gender != 'both'){
        console.log(gender);
        var arrayGender = document.getElementsByClassName(gender);
        for (var i = 0;i < arrayGender.length; i++){
        arrayGender[i].style.display = 'none';
        };
    };
};


// give more info
function giveMoreInfo(ID){
    var obj = myData.laureates;

    
    var moreInfoElem = "<div id=\"simpleModal\" class=\"modal\"><div class=\"modal-content\"><div class=\"modal-header\"><span class=\"closeBtn\" onclick=\"closeModal()\">&times;</span><h2>More about "+ obj[ID].firstname + " " + obj[ID].surname + " </h2></div><div class=\"modal-body\"><div class=\"modal-body-left\">  <ul><li>Was born in " + getYear(obj[ID].born) +" in "+ obj[ID].bornCity + "</li><li>Died in" + getYear(obj[ID].died) + "</li></ul></div><div class=\"modal-body-right\"><p>The motivation for this price were :</p><p>" + obj[ID].prizes[0].motivation + "</p><p>The affiliation of this prize is with" + obj[ID].prizes[0].affiliations[0].name + " in " + obj[ID].prizes[0].affiliations[0].namecity + ", " + obj[ID].prizes[0].affiliations[0].country + "</p></div></div><div class=\"modal-footer\"><h3>What a great discovery</h3></div></div></div>";

    // did't find an easy way to append html element to my html with javascript thus the jquery 
    $('#mainWrapper').append(moreInfoElem);
};


function findID (ID){
    var obj = myData.laureates;
    for (var i=0; i < obj.length; i++){
        if (ID == obj[i].id){
            giveMoreInfo(i);
            break;
        }
    };
}

function getYear(date){
    if (date == "0000-00-00") {
        return "not relevent"
    } else {
    return date.substr(0,4)}
};

// Function to close modal
function closeModal(){
    console.log("close btn");
    var modal = document.getElementById('simpleModal');
    var parent = document.getElementById('mainWrapper');
    parent.removeChild(modal);

};
