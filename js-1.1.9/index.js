$(document).ready(function(){
    //these functions available once page loaded
    
    $("#testfill").click(function(){//autofills the form with acceptable test patient data for ease during testing (not accessible when Joe Bloggs button hidden in live version)
		$('#name').val("Joe Bloggs");
		checkProgress("name");
		$('#dob').val("12/03/2010");
		checkProgress("dob");
		$('#num').val("1234567");
		checkProgress("num");
		$('#protocolStart').val(moment().format('DD/MM/YYYY HH:mm'));
		checkProgress("protocolStart");
		$('#sex').val("3");
		checkProgress("sex");
		$('#weight').val("42");
		checkProgress("weight");
		$('#pH').val("7.12");
		checkProgress("pH");
		$('#shock').val("2");
		checkProgress("shock");
		$('#insulin').val("2");
		checkProgress("insulin");
		$('#preDM').val("2");
		checkProgress("preDM");
		$('#region').val("16");
		checkProgress("region");		
		$('#centre').val("[Testing purposes only]");
		checkProgress("centre");
		add_auditID();
	});
    
  $("#btnsubmit").click(function(){ //runs on clicking submit - updates the styling and info messages for all inputs - if correct then also calls the pdf function and submits non-confidential form to server
	
	//cycles through all the inputs and runs their check functions, and updates their success/error styling. Also counts the number of inputs who's check function returns true
	var correctCount = 0;
	var inputs = getInputs();
	var x;
	for (x in inputs){
		functionName = window["check"+x];
		if(x!="region"){ //skip region as its check function would clear the centre select list
			var checkReturn = functionName(inputs);
			if(checkReturn===true){
				correctCount++;
				//updates styling for ALL inputs
				$("#div_"+x+"_info").text("");
				$("#div_"+x).addClass("has-success").removeClass("has-error");
				$("#div_"+x+"_glyph").html("<span class='glyphicon glyphicon-ok form-control-feedback'></span>");
			} else {
				$("#div_"+x+"_info").text(checkReturn);
				$("#div_"+x).addClass("has-error").removeClass("has-success");
				$("#div_"+x+"_glyph").html("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
			}
		}
	}

	if(correctCount===13){//13 rather than 14 correctCount as region skipped as above
		if (document.getElementById("overrideCheckbox").checked === true){
			bootbox.confirm({
				title: "<span style='font-size: 24px'>You are overriding the weight safety range</span>",
				message: "You should only continue if you are sure " + inputs.weight + "kg is the correct weight and you have considererd using a maximum weight of 80kg or the 98th centile (whichever is lower) as per the care pathway.<br><br>The daily volume for maintenance fluids is calculated using the Holliday-Segar formula but is capped at 3000mL. <br><br>The deficit replacement volume and bolus volumes are uncapped and will be calculated based on " + inputs.weight + "kg.<br><br>Are you sure you want to proceed?",
				buttons: {
					cancel: {
						label: '<i class="fa fa-times"></i> Go back and review'
					},
					confirm: {
						label: '<i class="fa fa-check"></i> Proceed with weight of ' + inputs.weight + 'kg',
						className: 'btn-danger'
					}
				},
				backdrop: true,
				size: "large",
				callback: function (result) {
					if (result===true){
						submitForm(inputs);
					}
				}
			});
		} else {
			submitForm(inputs);
		}
	} else {
		// if not all correct then create warning banner
		$("#warn").html("<div class='alert alert-warning alert-dismissible'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Warning!</strong> Correct the errors above before proceeding.</div>");
	}
  });
});

function submitForm(inputs){
	// passes form data to database save page
	sessionStorage.setItem("name", inputs.name);
	sessionStorage.setItem("dob", inputs.dob);
	sessionStorage.setItem("num", inputs.num);
	sessionStorage.setItem("protocolStart", inputs.protocolStart);
	if (inputs.sex()==="2"){
		sessionStorage.setItem("sex", "Female");
	} else if (inputs.sex()==="3"){
		sessionStorage.setItem("sex", "Male");
	} else {
		sessionStorage.setItem("sex", "error");
	}
	sessionStorage.setItem("age", inputs.age);
	sessionStorage.setItem("weight", inputs.weight);
	if (document.getElementById("overrideCheckbox").checked === true){
		sessionStorage.setItem("override", "Yes");
	} else {
		sessionStorage.setItem("override", "No");
	}
	sessionStorage.setItem("pH", inputs.pH);
	if (inputs.shock()==="2"){
		sessionStorage.setItem("shock", "No");
	} else if (inputs.shock()==="3"){
		sessionStorage.setItem("shock", "Yes");
	} else {
		sessionStorage.setItem("shock", "error");
	}
	if (inputs.insulin()==="2"){
		sessionStorage.setItem("insulin", "0.05");
	} else if (inputs.insulin()==="3"){
		sessionStorage.setItem("insulin", "0.1");
	} else {
		sessionStorage.setItem("insulin", "error");
	}
	if (inputs.preDM()==="2"){
		sessionStorage.setItem("preDM", "No");
	} else if (inputs.preDM()==="3"){
		sessionStorage.setItem("preDM", "Yes");
	} else {
		sessionStorage.setItem("preDM", "error");
	}
	sessionStorage.setItem("region", $("#region option:selected").html());
	sessionStorage.setItem("centre", $("#centre option:selected").html());
	sessionStorage.setItem("auditID", inputs.auditID());

	//sets the POST format of protocolStart to be compatible with SQL database
	document.getElementById('protocolStart').value = moment(inputs.protocolStart, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');

	//sets the client datetime hidden input for posting and session storage
	var client_DT = moment().format('YYYY-MM-DD HH:mm:ss'); //use this format for POST (compatible with SQL)
	document.getElementById('client_DT').value = client_DT;
	client_DT = moment().format('DD/MM/YYYY HH:mm'); //use this format for sessionStorage (preferred format for printing on protocol)
	sessionStorage.setItem("client_DT", client_DT);

	//sets the client userAgent hidden input for posting
	document.getElementById('client_uA').value = window.navigator.userAgent;

	$("#protocolForm").submit(); //submits the non-patient identifiable section of the form to the server
}

function getInputs(){ //creates an object (inputs) containing the values (or functions returning the values) of all the inputs on the forms ***contains confidential data***
	var inputs = {
		name: document.getElementById('name').value, 
		dob: document.getElementById('dob').value, 
		num: document.getElementById('num').value,
		protocolStart: document.getElementById('protocolStart').value,
		sex: function(){
			var ctrlsex = document.getElementById("sex");
			var getsex = ctrlsex.options[ctrlsex.selectedIndex].value;
			return getsex;
		},
		age: parseFloat(document.getElementById('age').value),
		weight: parseFloat(document.getElementById('weight').value),
		pH: parseFloat(document.getElementById('pH').value),
		shock: function(){
			var ctrlshock = document.getElementById("shock");
			var getshock = ctrlshock.options[ctrlshock.selectedIndex].value;
			return getshock;
		},
		insulin: function(){
			var ctrlinsulin = document.getElementById("insulin");
			var getinsulin = ctrlinsulin.options[ctrlinsulin.selectedIndex].value;
			return getinsulin;
		},
		preDM: function(){
			var ctrlpreDM = document.getElementById("preDM");
			var getpreDM = ctrlpreDM.options[ctrlpreDM.selectedIndex].value;
			return getpreDM;
		},
		region: function(){
			var ctrlregion = document.getElementById("region");
			var getregion = ctrlregion.options[ctrlregion.selectedIndex].value;
			return getregion;
		},
		centre: function(){
			var ctrlcentre = document.getElementById("centre");
			var getcentre = ctrlcentre.options[ctrlcentre.selectedIndex].value;
			return getcentre;
		},
		auditID: function(){
			var getauditID = document.getElementById('auditID').value;
			return getauditID;
		}
	};
	return inputs;
}

function isMale(inputs){ //returns true if male selected
	if (inputs.sex() == "3") return true;
}

function isFemale(inputs){ //returns true if female selected
	if (inputs.sex() == "2") return true;
}

function getLimits(inputs){//returns weight +/- 2SD for age in months (uses arrays in js/weightLimits.js)
    var ageMonths = moment().diff(moment(inputs.dob, "DD/MM/YYYY"), 'months');
	if (isMale(inputs)){
		var limits = {lower: maleLowerLimit[ageMonths], upper: maleUpperLimit[ageMonths]};
		if (limits.upper>weightCeiling){
			limits.upper = weightCeiling;
		}
		return limits;
	} else if (isFemale(inputs)){
		var limits = {lower: femaleLowerLimit[ageMonths], upper: femaleUpperLimit[ageMonths]};
		if (limits.upper>weightCeiling){
			limits.upper = weightCeiling;
		}
		return limits;
	}
	console.log('getLimits error: patient sex undefined');
}

function populateCentres(centreList){ //receives an array containing the hospitals of the selected region from the checkregion function and populates the centre menu with these
    var centreMenu = document.getElementById("centre");
    document.getElementById("centre").options[0]=new Option("Select your centre from list:","");
    
    for(var i = 0; i < centreList.length; i++) {
        var centreFromList = centreList[i];
    
        var menuOption = document.createElement("option");
        menuOption.text = centreFromList;
        menuOption.value = centreFromList;
    
        centreMenu.add(menuOption);
    }
}

function checkProgress(triggerctrl){ //runs onBlur of any input on forms (except age) - updates the progress bar, and the styling and info text for the triggering input
	//checks the changed input against its check function
	var inputs = getInputs();
	functionName = window["check"+triggerctrl];
	var checkReturn = functionName(inputs);
	
	//changes styling for triggering input
	if(checkReturn===true){
		$("#div_"+triggerctrl+"_info").text("");
		$("#div_"+triggerctrl).addClass("has-success").removeClass("has-error");
        $("#div_"+triggerctrl+"_glyph").html("<span class='glyphicon glyphicon-ok form-control-feedback'></span>");
	} else {
		if (triggerctrl==="weight"){
			$("#div_"+triggerctrl+"_info").text(checkReturn);	
		}else{
			$("#div_"+triggerctrl+"_info").text("");
		}
		$("#div_"+triggerctrl).removeClass("has-success");
		$("#div_"+triggerctrl+"_glyph").html("<span class='glyphicon form-control-feedback'></span>");
	}
	
    //update progress bar appearance (and remove warning banner if applicable)
	var correctCount = document.getElementsByClassName("has-success").length;
	$("#progBar").css("width", ((correctCount/14)*100)+"%").attr("aria-valuenow", 50);
	if(correctCount===14){
		$("#progBar").addClass("progress-bar-success").removeClass("active progress-bar-striped");
		$("#warn").html("");
	} else {
		$("#progBar").addClass("active progress-bar-striped").removeClass("progress-bar-success");
	}
	
	//triggers check progress for age if DOB changed
	if(triggerctrl==="dob"){
	    checkProgress("age");
	    if (checkReturn!==true){ //if the check function for dob failed then set age input as blank and clear its styling
	        $("#age").val(null)
    		$("#div_age_info").text("");
    		$("#div_age").removeClass("has-error has-success");
            $("#div_age_glyph").html("");
	    }
	}
}

//
//below are all the check functions for each input, called by the checkProgress function or on btnsubmit click
//

function checkname(inputs){ //the check function for the name input - returns true if valid, else returns string describing the error to be corrected
	var letters = /^[a-zA-Z-' ]+$/;
	if(inputs.name.match(letters)) {
		//name contains appropriate characters
		if (inputs.name.length <5){
			//name too short
			return "Enter full name.";
		} else {
			//name not too short
			return true;
		}
	} else { 
		//name contains inappropriate characters
		return "Only characters A-Z, hyphen and apostrophe permitted.";
	}
}

function checkdob(inputs){ //the check function for the dob input - returns true if valid and sets age, else returns string describing the error to be corrected 
	const rightFormat = ['DD/MM/YYYY'];
	if (moment(inputs.dob, rightFormat, true).isValid()){ //is valid date
		if (moment().diff(moment(inputs.dob, "DD/MM/YYYY"), 'days') > 0){ //is before today
			$("#age").val(moment().diff(moment(inputs.dob, "DD/MM/YYYY"), 'years')); //set age
			return true;
		} else { //is today or future
			return "Date of birth must be before today.";
		}
	} else { //is invalid date
		return "Date must be in the format DD/MM/YYYY.";
    };
}

function checknum(inputs){ //the check function for the num input - returns true if valid, else returns string describing the error to be corrected 
	if (inputs.num.length <5){
		//too short
		return "Enter full hospital/NHS number.";
	} else {
		//not too short
		return true;
	};
}

function checkprotocolStart(inputs){ //the check function for the protocolStart input - returns true if valid, else returns string describing the error to be corrected 
    const rightFormat = ['DD/MM/YYYY HH:mm'];
	if (moment(inputs.protocolStart, rightFormat, true).isValid()){
		if (moment().diff(moment(inputs.protocolStart, "DD/MM/YYYY HH:mm"), 'hours') >= 0){ //is not in the future
			return true;
		} else { //is future
			return "Protocol start date/time cannot be in the future.";
		}
	} else { //is invalid datetime
		return "Protocol start date/time must be in the format DD/MM/YYYY HH:MM.";
    };
	
}

function checksex(inputs){
    if(inputs.sex()=== "1" ){ //no selection made
		return "Select an option from the drop-down menu.";
	} else { //selection made
		return true;
	}
}

function checkage(inputs){ //the check function for the age input - returns true if valid, else returns string describing the error to be corrected 
	if($.isNumeric(inputs.age)&&(inputs.age)!=null){
		if ((inputs.age) < 19 && (inputs.age) >= 0)	{ //is between 0 and 18
			return true;
		} else { //out of range
			return "Age must be between 0 and 18 years.";
		}
	} else { //is NaN
		return "Enter valid date of birth and age will be calculated automatically.";
	}
}

function checkweight(inputs){ //the check function for the weight input - returns true if valid, else returns string describing the error to be corrected 
	if (inputs.sex()=="1"){
		return "Cannot check weight against acceptable range until patient's sex is selected.";
	} else if (inputs.age>=0&&inputs.age<19){
		if($.isNumeric(inputs.weight)){
			//all numbers
			var limits = getLimits(inputs);
			if (document.getElementById("overrideCheckbox").checked == true){
				//override checked, therefore don't check against range
				return true;
			} else {
				//override not checked, therefore check against range
				if (inputs.weight < limits.lower || inputs.weight > limits.upper)	{
					//incorrect range
					document.getElementById("override").style.display = "block";
					return "Weight must be within 2 standard deviations of the mean for age (upper limit 80kg) ("+limits.lower+"kg to "+limits.upper+"kg).";
				} else {
					//correct range
					document.getElementById("overrideCheckbox").checked = false;
					document.getElementById("override").style.display = "none";
					return true;
				}
			}
		} else {
			//not all numbers
			document.getElementById("overrideCheckbox").checked = false;
			document.getElementById("override").style.display = "none";
			return "Weight may only contain digits (0-9) and decimal(.).";
		}
	} else {
		return "Cannot check weight against acceptable range until patient's age is set.";		
	}
}

function checkpH(inputs){ //the check function for the pH input - returns true if valid, else returns string describing the error to be corrected 
	if($.isNumeric(inputs.pH)){
		//all digits and decimal
		if (inputs.pH < 6.5 || inputs.pH > 7.4)	{
			//inappropriate range
			return "pH must be in the range 6.5 to 7.4.";
		} else {
			return true;
		}
	} else {
		//not all digits and decimal
		return "pH must contain only digits (0-9) and decimal(.).";
	}
}

function checkshock(inputs){//the check function for the shock input - returns true if valid, else returns string describing the error to be corrected 
    if(inputs.shock()=== "1" ){ //no selection made
		return "Select an option from the drop-down menu.";
	} else { //selection made
		return true;
	}
}

function checkinsulin(inputs){//the check function for the insulin input - returns true if valid, else returns string describing the error to be corrected 
    if(inputs.insulin()=== "1" ){ //no selection made
		return "Select an option from the drop-down menu.";
	} else { //selection made
		return true;
	}
}

function checkpreDM(inputs){ //the check function for the preDM input - returns true if valid, else returns string describing the error to be corrected 
	if(inputs.preDM()=== "1" ){ //no selection made
		return "Select an option from the drop-down menu.";
	} else { //selection made
		return true;
	}
}

function checkregion(inputs){ //the check function for the region input - returns true if valid and calls function to populate the centre menu, else returns string describing the error to be corrected 
	if(inputs.region()=== "1" ){ //no selection made
		document.getElementById("centre").length = 0;
		return "Select your region from the drop-down menu.";
	} else {
		document.getElementById("centre").length = 0;
		switch(inputs.region()){ //in each case calls the populationCentres function, passing the array containing the hospitals of the selected region (from js/regionHospitals.js) to be added to the centre menu
			case "2": 
				populateCentres(northernIreland);
				break;
			case "3": 
				populateCentres(scotland);
				break;
			case "4": 
				populateCentres(wales);
				break;
			case "5":
				populateCentres(eastMidlands);
				break;
			case "6":
                populateCentres(eastOfEngland);
				break;
			case "7": 
                populateCentres(northEastAndNorthCumbria);
				break;
			case "8": 
                populateCentres(northWest);
				break;
			case "9": 
                populateCentres(southEastCoastAndLondonPartnership);
				break;
			case "10": 
                populateCentres(southWest);
				break;
			case "11": 
                populateCentres(thamesValley);
				break;
			case "12":
                populateCentres(wessex);
				break;
			case "13": 
                populateCentres(westMidlands);
				break;
			case "14": 
                populateCentres(yorkshireAndHumber);
				break;
			case "15": //option so I can identify test patients in the database
                populateCentres(testing);
				break;
			default:
				console.log("Error selecting region");
		}
		return true;
	}
}

function checkcentre(inputs){ //the check function for the centre input - returns true if valid, else returns string describing the error to be corrected 
	if(inputs.centre()=== "" ){ //no selection made
		return "Select your centre from the drop-down menu.";
	} else {
		return true;
	}
}

function checkauditID(inputs){ //the check function for the auditID input - returns true if valid, else returns string describing the error to be corrected 
	if (inputs.auditID() === ""){
		return "Generate an episode audit ID with the button provided.";
	} else {
		return true;
	}
}