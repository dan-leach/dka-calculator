//commenting
//last few store functions

var indexForm = {
	clear: function(){
		$('#name').val("");
		$('#dob').val("");
		$('#num').val("");
		$('#protocolStart').val("");
		$('#sex').val("1");
		$('#weight').val("");
		$('#overrideCheckbox').prop( "checked", false );
		$('#pH').val("");
		$('#shock').val("1");
		$('#insulin').val("1");
		$('#preDM').val("1");
		$('#region').val("1");
		$('#episode').val("1");
		console.log('Form cleared');
	},
	joeBloggs: function(){
		const joeBloggs = [
			"Joe Bloggs",
			"12/03/2010",
			"1234567",
			moment().format('DD/MM/YYYY HH:mm'),
			"3",
			"", //skip age
			"200",
			"7.12",
			"2",
			"2",
			"2",
			"10",
			"University Hospitals Bristol",
			"4",
		];
		var x = 0;
		for (input in indexForm.inputs){
			if (!(x==5)){ //skip age as set by dob.blur()
				indexForm.inputs[input].set(joeBloggs[x]);
				indexForm.inputs[input].blur();
			}
			x++;
		}
		$('#overrideCheckbox').prop( "checked", true );
		indexForm.inputs.weight.blur();
	},
	inputs: {
		name: {
			name: "name",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.goodChars() && this.goodLength()) return true;
				return false;
			},
			goodChars: function(){
				var chars = /^[a-zA-Z-' ]+$/;
				if (this.value().match(chars)) return true;
				return false;
			},
			goodLength: function(){
				if (this.value().length > 4) return true;
				return false;
			},
			failMsg: function(){
				if (!this.goodLength()) return "Enter full name (minimum 5 characters).";
				if (!this.goodChars()) return "Only characters A-Z, hyphen and apostrophe permitted.";
				throw "Unable to select failMsg";
			}
		},
		dob: {
			name: "dob",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
					indexForm.inputs.age.set(moment().diff(moment(this.value(), "DD/MM/YYYY"), 'years'));
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.inputs.age.set(-1);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.inputs.age.blur();
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.goodFormat() && this.beforeToday()) return true;
				return false;
			},
			goodFormat: function(){
				if (moment(this.value(), 'DD/MM/YYYY', true).isValid()) return true;
				return false;
			},
			beforeToday: function(){
				if (moment().diff(moment(this.value(), "DD/MM/YYYY"), 'days') > 0) return true;
				return false;
			},
			failMsg: function(){
				if (!this.goodFormat()) return "Date must be in the format DD/MM/YYYY.";
				if (!this.beforeToday()) return "Date of birth must be before today";
				throw "Unable to select failMsg";
			}
		},
		num: {
			name: "num",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.goodLength()) return true;
				return false;
			},
			goodLength: function(){
				if (this.value().length > 4) return true;
				return false;
			},
			failMsg: function(){
				if (!this.goodLength()) return "Enter full hospital/NHS number (minimum 5 characters).";
				throw "Unable to select failMsg";
			}
		},
		protocolStart: {
			name: "protocolStart",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.goodFormat() && this.notFuture() && this.isRecent()) return true;
				return false;
			},
			goodFormat: function(){
				if (moment(this.value(), 'DD/MM/YYYY HH:mm', true).isValid()) return true;
				return false;
			},
			notFuture: function(){
				if (moment().diff(moment(this.value(), "DD/MM/YYYY HH:mm"), 'hours') >= 0) return true;
				return false;
			},
			isRecent: function(){
				if (moment().diff(moment(this.value(), "DD/MM/YYYY HH:mm"), 'days') < 32) return true;
				return false;
			},
			failMsg: function(){
				if (!this.goodFormat()) return "Protocol start date/time must be in the format DD/MM/YYYY HH:MM.";
				if (!this.notFuture()) return "Protocol start date/time cannot be in the future.";
				if (!this.isRecent()) return "Protocol start date/time must be within the last month.";
				throw "Unable to select failMsg";
			}
		},
		sex: {
			name: "sex",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.isMale()) {
					sessionStorage.setItem(this.name, "Male");
					return;
				} else if (this.isFemale()) {
					sessionStorage.setItem(this.name, "Female");
					return;
				}
				throw "unable to store sex";
			},
			isMale: function(){
				if (this.value() == "3") return true;
				return false;
			},
			isFemale: function(){
				if (this.value() == "2") return true;
				return false;
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		age: {
			name: "age",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.setValid() && this.inRange()) return true;
				return false;
			},
			setValid: function(){
				if ($.isNumeric(this.value()) && (this.value) != null) return true;
				return false;
			},
			inRange: function(){
				if (this.value() < 19 && this.value() >= 0) return true;
				return false;
			},
			failMsg: function(){
				if (!this.setValid()) return "Enter valid date of birth and age will be calculated automatically.";
				if (!this.inRange()) return "Age must be between 0 and 18 years.";
				throw "Unable to select failMsg";
			}
		},
		weight: {
			name: "weight",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value())
				if (this.isOverridden()) {
					sessionStorage.setItem("override", "Yes");
				} else {
					sessionStorage.setItem("override", "No");
				}
			},
			blur: function(){
				if (this.canCheck() && this.setValid){
					if (this.inRange()){
						indexForm.style.setPass(this.name);
						this.hideOverride();
						indexForm.style.progressBar();
						return;
					} else if (this.isOverridden()) {
						indexForm.style.setPass(this.name);
						indexForm.style.progressBar();
						return;
					} else {
						this.showOverride();
						indexForm.style.progressBar();
					}
				}
				indexForm.style.setNeutral(this.name);
				indexForm.style.setMsg(this.name, this.failMsg());
			},
			pass: function(){
				if ((this.canCheck() && this.setValid()) && (this.isOverridden() || this.inRange())) return true;
				return false;
			},
			isOverridden: function(){
				return document.getElementById("overrideCheckbox").checked; 
			},
			canCheck: function(){
				if (indexForm.inputs.sex.pass() && indexForm.inputs.age.pass()) return true;
				return false;
			},
			setValid: function(){
				if ($.isNumeric(this.value()) && (this.value()) != null) return true;
				return false;
			},
			limits: function(){
				var ageMonths = moment().diff(moment(indexForm.inputs.dob.value(), "DD/MM/YYYY"), 'months');
				if (indexForm.inputs.sex.isMale()) var limits = {lower: maleLowerLimit[ageMonths], upper: maleUpperLimit[ageMonths]};
				if (indexForm.inputs.sex.isFemale()) var limits = {lower: femaleLowerLimit[ageMonths], upper: femaleUpperLimit[ageMonths]};
				if (limits.upper>weightCeiling) limits.upper = weightCeiling;
				return limits;
			},
			inRange: function(){
				if (this.value() > this.limits().lower && this.value() < this.limits().upper) return true;
				return false;
			},
			failMsg: function(){
				if (!this.canCheck()) return "Cannot check weight against acceptable range until patient's age and sex is set.";
				if (!this.setValid()) return "Weight may only contain digits (0-9) and decimal(.).";
				if (!this.inRange()) return "Weight must be within 2 standard deviations of the mean for age (upper limit 75kg) ("+this.limits().lower+"kg to "+this.limits().upper+"kg).";
				throw "Unable to select failMsg";
			},
			showOverride: function(){
				document.getElementById("override").style.display = "block";
			},
			hideOverride: function(){
				document.getElementById("overrideCheckbox").checked = false;
				document.getElementById("override").style.display = "none";
			},
		},
		pH: {
			name: "pH",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.setValid() && this.inRange()) return true;
				return false;
			},
			setValid: function(){
				if ($.isNumeric(this.value()) && (this.value) != null) return true;
				return false;
			},
			inRange: function(){
				if (this.value() <= 7.4 && this.value() >= 6.5) return true;
				return false;
			},
			failMsg: function(){
				if (!this.setValid()) return "pH must contain only digits (0-9) and decimal(.).";
				if (!this.inRange()) return "pH must be in the range 6.5 to 7.4.";
				throw "Unable to select failMsg";
			}
		},
		shock: {
			name: "shock",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.isShocked()) {
					sessionStorage.setItem(this.name, "Yes");
				} else {
					sessionStorage.setItem(this.name, "No");
				}
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			isShocked: function(){
				if (this.value()=="3") return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		insulin: {
			name: "insulin",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.standardRate()) {
					sessionStorage.setItem(this.name, "0.05");
				} else {
					sessionStorage.setItem(this.name, "0.1");
				}
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			standardRate: function(){
				if (this.value() == "2") return true;
				return false;
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		preDM: {
			name: "preDM",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.isDiabetic()) {
					sessionStorage.setItem(this.name, "Yes");
				} else {
					sessionStorage.setItem(this.name, "No");
				}
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			isDiabetic: function(){
				if (this.value() == "3") return true;
				return false;
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		region: {
			name: "region",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem("region", $("#region option:selected").html());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
					indexForm.inputs.centre.populate(regions[this.value()]);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
					indexForm.inputs.centre.reset();
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		centre: {
			name: "centre",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			populate: function(centreList){
				//receives an array containing the hospitals of the selected region from the checkregion function and populates the centre menu with these
				document.getElementById("centre").length = 0; //removes centres already in list if region changed
				document.getElementById("centre").options[0]=new Option("Select your centre from list:","");
				var menuOption
				for(var i = 0; i < centreList.length; i++) {
					menuOption = document.createElement("option");
					menuOption.text = centreList[i];
					menuOption.value = centreList[i];
					document.getElementById("centre").add(menuOption);
				}
			},
			reset: function(){
				document.getElementById("centre").length = 0; //removes centres already in list if region changed
				document.getElementById("centre").options[0]=new Option("Select region first.","0");
				indexForm.style.setNeutral(this.name);
				indexForm.style.setMsg(this.name, "");
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem("centre", $("#centre option:selected").html());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() == "0" || this.value() == "")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		episode: {
			name: "episode",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem("episode", $("#episode option:selected").html());
			},
			blur: function(){
				if (this.pass()) {
					indexForm.style.setPass(this.name);
				} else {
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				}
				indexForm.style.progressBar();
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
	},
	style: {
		setPass: function(input){
			this.setMsg(input, "");
			$("#div_"+input).addClass("has-success").removeClass("has-error");
			$("#div_"+input+"_glyph").html("<span class='glyphicon glyphicon-ok form-control-feedback'></span>");
		},
		setNeutral: function(input){
			$("#div_"+input).removeClass("has-success");
			$("#div_"+input).removeClass("has-error");
			$("#div_"+input+"_glyph").html("<span class='glyphicon form-control-feedback'></span>");
		},
		setFail: function(input){
			$("#div_"+input).addClass("has-error").removeClass("has-success");
			$("#div_"+input+"_glyph").html("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
		},
		setMsg: function(input, msg){
			$("#div_"+input+"_info").text(msg);
		},
		progressBar: function(){
			var passCount = 0;
			for (input in indexForm.inputs){
				if (indexForm.inputs[input].pass()) {
					passCount++;
				}
			}
		    //update progress bar appearance (and remove warning banner if applicable)
			$("#progBar").css("width", ((passCount/14)*100)+"%").attr("aria-valuenow", 50);
			if(passCount===14){
				$("#progBar").addClass("progress-bar-success").removeClass("active progress-bar-striped");
				$("#warn").html("");
			} else {
				$("#progBar").addClass("active progress-bar-striped").removeClass("progress-bar-success");
			}
		},
	},
	submit: {
	    click: function(){
    		if (!this.check()) return false;
    		if (indexForm.inputs.weight.isOverridden()) {
				this.confirmOverride();
			} else {
				this.send();
			}
	    },
	    check: function(){
			var failCount = 0;
			for (input in indexForm.inputs){
				if (!indexForm.inputs[input].pass()) {
					failCount++;
					console.log(indexForm.inputs[input].name + " fails submitCheck");
					indexForm.style.setFail(indexForm.inputs[input].name);
					indexForm.style.setMsg(indexForm.inputs[input].name, indexForm.inputs[input].failMsg());
				}
			}
			if (failCount == 0){
				console.log("submitCheck passes");
				return true;
			}
			$("#warn").html("<div class='alert alert-warning alert-dismissible'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Warning!</strong> Correct the errors above before proceeding.</div>");
			return false;
		},
	    confirmOverride: function(){
    	    bootbox.confirm({
    			message: '<div class="panel panel-danger"><div class="panel-heading" style="font-size:24px;">You are overriding the weight safety range</div><div class="panel-body">You should only continue if you are sure ' + indexForm.inputs.weight.value() + 'kg is the correct weight and you have considererd using a maximum weight of the 98th centile weight for age as per the care pathway.<br><br>You can proceed with a weight that is outside the expected range, however the calculator has upper limits that cannot be overriden. These are based on a maximum weight of 75kg. Any calculated values that exceed this will be capped as follows:<div class="well"><ul><li>Daily maintenance volume is capped at 2600mL (Holliday-Segar formula for 75kg)</li><li>Deficit volume is capped at 7500mL for patients with severe DKA (10% dehydration for 75kg)</li><li>Deficit volume is capped at 3750mL for patients with mild or moderate DKA (5% dehydration for 75kg)</li><li>Bolus volumes are capped at 750mL (10mL/kg for 75kg)</li><li>Insulin rate is capped at 7.5 Units/hour if insulin rate of 0.1 Units/kg/hour is selected (0.1 Units/kg/hour for 75kg patient)</li><li>Insulin rate is capped at 3.75 Units/hour if insulin rate of 0.05 Units/kg/hour is selected (0.05 Units/kg/hour for 75kg patient)</li></ul></div><strong>Calculations will based on ' + indexForm.inputs.weight.value() + 'kg and only capped if they exceed the values above.</strong><br>Bear in mind that these caps could still allow significantly excessive values especially if your patient is much smaller than 75kg.</div></div>',
    			buttons: {
    				cancel: {
    					label: '<i class="fa fa-times"></i> Go back and review'
    				},
    				confirm: {
    					label: '<i class="fa fa-check"></i> Proceed with weight of ' + indexForm.inputs.weight.value() + 'kg',
    					className: 'btn-danger'
    				}
    			},
				closeButton: false,
    			backdrop: true,
    			size: "large",
    			callback: function (result) {
    				if (result===true){
    					indexForm.submit.send();
    				}
    			}
    		});
    	},
    	store: function(){
			for (input in indexForm.inputs){
				indexForm.inputs[input].store();
			}
        	sessionStorage.setItem("auditID", document.getElementById('auditID').value); //auditID is not included in indexForm.inputs
			sessionStorage.setItem("client_DT", moment().format('DD/MM/YYYY HH:mm')); //use this format for sessionStorage (preferred format for printing on protocol));
    	},
		preSendSet: function(){
    	    //sets the POST format of protocolStart to be compatible with SQL database
        	document.getElementById('protocolStart').value = moment(indexForm.inputs.protocolStart.value(), 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');  
        	//sets the client datetime hidden input for posting and session storage
        	document.getElementById('client_DT').value = moment().format('YYYY-MM-DD HH:mm:ss') //use this format for POST (compatible with SQL)
	        document.getElementById('client_uA').value = window.navigator.userAgent; //sets the client userAgent hidden input for posting
    	},
    	send: function(){
			this.store();
			this.preSendSet();
    		$("#protocolForm").submit();
    	},
	},
	
}

$(document).ready(function(){ //fires once page loaded
	indexForm.clear();	
	add_auditID(); //automatically fills the auditID field
	indexForm.style.setPass("auditID");
});
