history.replaceState(null, "", "/"); //ensures that if page refreshed will simply reload start page rather than reloading submit and causing errors

const calcVars = getCalcVars(inputs);

const showWorking = {
    click: function(){ //triggered by user clicking show working
        try{
            var workingDisplay = "";
            for (calc in this.calcs) { //builds the HTML components that make up the show working modal content, one calculation at a time
                workingDisplay = workingDisplay + '<style>.well {margin-bottom: 5px;}.bg-clear {background-color: transparent;}</style><div class="panel panel-info"><div class="panel-heading"><strong>' + this.calcs[calc].name + '</strong></div><div class="panel-body"><div class="row"><div class="col-md-2"><div class="well well-sm bg-clear"><strong>Formula:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].formula() + '</div></div>';
                if (!this.calcs[calc].limit().length == 0){ //show the limit line only if there is a limit
                    workingDisplay = workingDisplay + '<div class="col-md-2"><div class="well well-sm bg-clear"><strong>Limit*:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].limit() + '</div></div>';
                }   
                workingDisplay = workingDisplay + '<div class="col-md-2"><div class="well well-sm bg-clear"><strong>Working:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].working() + '</div></div><div class="col-md-2"><div class="well well-sm bg-clear"><strong>Output:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].output() + '</div></div></div></div></div>';
            }
            workingDisplay = workingDisplay + "*limits set based on weight of " + settings.caps.weight + "kg";
            bootbox.dialog({ //show the modal
                message: workingDisplay,
                size: 'large',
                backdrop: true,
                closeButton: false,
                buttons: {
                    cancel: {
                        label: 'Close'
                    }
                }
            });
        } catch (e) {
			errHandler(e);
		}
    },
    calcs: { //the formula, limit (where applicable), working and output for each calculated variable
        deficitPercentage: { 
            name: "Deficit percentage",
            formula: function() {
                return "pH range [" + settings.severity.mild.range.lower + " to " + settings.severity.mild.range.upper + " = " + settings.severity.mild.deficitPercentage + "%] or [" + settings.severity.moderate.range.lower + " to " + settings.severity.moderate.range.upper + " = " + settings.severity.moderate.deficitPercentage + "%] or [" + settings.severity.severe.range.lower + " to " + settings.severity.severe.range.upper + " = " + settings.severity.severe.deficitPercentage + "%]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                if (calcVars.patient.severity.isSevere()) return "[pH " + inputs.pH.toFixed(2) + "] is in range [" + settings.severity.severe.range.lower + " to " + settings.severity.severe.range.upper + "] ==> " + calcVars.deficit.percentage() + "%";
                if (calcVars.patient.severity.isModerate()) return "[pH " + inputs.pH.toFixed(2) + "] is in range [" + settings.severity.moderate.range.lower + " to " + settings.severity.moderate.range.upper + "] ==> " + calcVars.deficit.percentage() + "%";
                if (calcVars.patient.severity.isMild()) return "[pH " + inputs.pH.toFixed(2) + "] is in range [" + settings.severity.mild.range.lower + " to " + settings.severity.mild.range.upper + "] ==> " + calcVars.deficit.percentage() + "%";
                throw "unable to show working";
            },
            output: function() {
                return calcVars.deficit.percentage() + "%";
            },
        },
        deficitVolume: {
            name: "Deficit volume",
            formula: function() {
                return "[Deficit percentage] x [Patient weight (kg)] x 10";
            },
            limit: function() {
                if (calcVars.deficit.percentage() == 5) return settings.caps.deficit5 + "mL (for 5% deficit)";
                if (calcVars.deficit.percentage() == 10) return settings.caps.deficit10 + "mL (for 10% deficit)";
                throw "unable to select limit";
            },
            working: function() {
                var working = "[" + calcVars.deficit.percentage() + "%] x [" + inputs.weight + "kg] x 10 = " + calcVars.deficit.volumeUncapped().toFixed() + "mL";
                if (calcVars.deficit.isCapped()) working = working + " (exceeds cap)";
                return working;
            },
            output: function() {
                return calcVars.deficit.volume().toFixed() + "mL";
            },
        },
        bolusVolume: {
            name: "Bolus volumes",
            formula: function() {
                return "[10mL/kg] x [Patient weight (kg)]";
            },
            limit: function() {
                return calcVars.bolus.volumeCapped() + "mL";
            },
            working: function() {
                var working = "[10mL/kg] x [" + inputs.weight + "kg] = " + calcVars.bolus.volumeUncapped(10).toFixed() + "mL";
                if (calcVars.bolus.isCapped(10)) working = working + " (exceeds cap)"; //capped working
                return working;
            },
            output: function() {
               return calcVars.bolus.volume(10).toFixed() + "mL";
            },
        },
        deficitVolumeLessBolus: {
            name: "Deficit volume less bolus",
            formula: function() {
                return "[Deficit volume] - [10mL/kg bolus (only for non-shocked patients)]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.deficit.volume().toFixed() + "mL] - [" + calcVars.deficit.bolusToSubtract().toFixed() + "mL] = " + calcVars.deficit.volumeLessBolus().toFixed() + "mL";
            },
            output: function() {
                return calcVars.deficit.volumeLessBolus().toFixed() + "mL";
            },
        },
        deficitReplacementRate: {
            name: "Deficit replacement rate",
            formula: function() {
                return "[Deficit volume less bolus] &#247; [48 hours]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.deficit.volumeLessBolus().toFixed() + "mL] &#247; [48 hours] = " + calcVars.deficit.rate().toFixed(1) + "mL/hour";
            },
            output: function() {
                return calcVars.deficit.rate().toFixed(1) + "mL/hour";
            },
        },
        maintenanceVolume: {
            name: "Daily maintenance volume",
            formula: function() {
                return "[100mL/kg for 0-10kg] + [50mL/kg for 10-20kg] + [20mL/kg for >20kg]"
            },
            limit: function() {
                return calcVars.maintenance.volumeCapped().toFixed() + "mL";
            },
            working: function() {
                if (inputs.weight < 10){
                    working = "[" + inputs.weight + "kg] x 100mL";
                } else if (inputs.weight <20){
                    working = "((["+inputs.weight+"kg] - 10kg) x 50mL) + 1000mL";
                } else {
                    working = "((["+inputs.weight+"kg] - 20kg) x 20mL) + 1500mL";
                }
                working = working + " = " + calcVars.maintenance.volumeUncapped().toFixed() + "mL";
                if (calcVars.maintenance.isCapped()) working = working + " (exceeds cap)";
                return working;
            },
            output: function() {
                return calcVars.maintenance.volume().toFixed() + "mL";
            },
        },
        maintenanceRate: {
            name: "Maintenance rate",
            formula: function() {
                return "[Daily maintenance volume] &#247; [24 hours]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.maintenance.volume().toFixed() + "mL] &#247; [24 hours] = " + calcVars.maintenance.rate().toFixed(1) + "mL/hour";
            },
            output: function() {
                return calcVars.maintenance.rate().toFixed(1) + "mL/hour";
            },
        },
        startingFluidRate: {
            name: "Starting fluid rate",
            formula: function() {
                return "[Deficit replacement rate] + [Maintenance rate]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.deficit.rate().toFixed(1) + "mL/hour] + [" + calcVars.maintenance.rate().toFixed(1) + "mL/hour] = " + calcVars.startingFluidRate().toFixed(1) + "mL/hour";
            },
            output: function() {
                return calcVars.startingFluidRate().toFixed(1) + "mL/hour";
            },
        },
        insulinRate: {
            name: "Insulin infusion rate",
            formula: function() {
                return "[Insulin rate (Units/kg/hour)] x [Patient weight]";
            },
            limit: function() {
                if (inputs.insulin == 0.05) return settings.caps.insulin005 + " Units/hour (for 0.05 Units/kg/hour)";
                if (inputs.insulin == 0.1) return settings.caps.insulin01 + " Units/hour (for 0.1 Units/kg/hour)";
                throw "unable to select limit";
            },
            working: function() {
                var working = "[" + inputs.insulin + " Units/kg/hour] x [" + inputs.weight + "kg] = " + calcVars.insulin.rateUncapped().toFixed(2) + " Units/hour";
                if (calcVars.insulin.isCapped()) working = working + " (exceeds cap)";
                return working;
            },
            output: function() {
                return calcVars.insulin.rate().toFixed(2) + " Units/hour";
            },
        },
    },
}

const generate = {
	click: function() { //runs on user clicking generate protocol
        if (this.internetExplorer.detect()){ //cannot use web worker method if IE
            this.internetExplorer.click();
        } else { //for any browser other than IE - uses web worker method which is preferred as prevents browser appearing unresponsive during pdfmake process. Cannot do this for IE as it will not allow passing blob back from webworker.
            try{
                console.log("main: browser is not IE: will use webWorker method.");
                var dialog = this.showLoading();
                var myWorker = this.startWebWorker();
                myWorker.onmessage = function(res) { //once response received from webWorker triggers download of pdf
                    if(res.data.stack){ //if res.data.stack is defined then it's an error being returned by web worker so pass res.data to errHandler
                        errHandler(res.data);
                    } else { //otherwise use the returned blob to create the download
                        try{
                            generate.handleWorkerResponse(res);
                            dialog.modal('hide');
                        } catch (e) {
                            errHandler(e);
                        }
                    }
                };
            } catch (e) {
                errHandler(e);
            }
        }
	},
	showLoading: function() { //shows a loading modal until the PDF generation is finished
		var dialog = bootbox.dialog({
			message: '<div class="panel panel-primary" style="text-align:center;"><div class="panel-heading">Please wait while the protocol is being generated...</div><div class="panel-body"><div class="row"><div class="col-sm-12"><i class="fa fa-spin fa-cog"></i><img src="/images/pageLoader.gif" alt="Loading..." style="display:block; margin-left:auto; margin-right:auto;" class="img-responsive"></div></div></div><div class="panel-footer">This can take up to a minute.</div></div>',
			closeButton: false,
		});
		return dialog;
	},
	startWebWorker: function(){ //launches the web worker that will generate the PDF blob
		console.log('main: starting webWorker.js...');
		const myWorker = new Worker('js-1.2.3/submitComponents/webWorker.js'); //start instance of webWorkerPDF.js
        myWorker.postMessage(inputs); //passes input data to webWorkerPDF.js
		console.log('main: request sent to webWorker.js...');
		return myWorker;
	},
	handleWorkerResponse: function(res){ //takes the 
		console.log('main: response received from webWorker.js...');
		// Automatically start file download
		const anchor = document.createElement('a');
		document.body.appendChild(anchor);
		anchor.href = window.URL.createObjectURL(res.data.pdfBlob);
		anchor.download = 'DKA Protocol for '+inputs.name+'.pdf';
		anchor.click();
		console.log('main: pdf download triggered...');
		this.success();
	},
	success: function(){ //show the success modal
		bootbox.dialog({
			message: '<div class="panel panel-success" style="text-align:center;"><div class="panel-heading">Protocol generated</div><div class="panel-body">The DKA protocol for '+inputs.name+' should now be downloading.</div></div>',
			size: 'small',
			closeButton: false,
			backdrop: false,
			buttons: {
				cancel: {
					label: 'Close'
				}
			}
		});
	},
	internetExplorer: { //functions relating to PDF generation for IE
		detect: function() { //returns true if browser is IE, otherwise returns false
			try{
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf('MSIE ');
                if (msie > 0) return true; // IE 10 or older
                var trident = ua.indexOf('Trident/');
                if (trident > 0) return true; // IE 11
                return false; //other browser
            } catch (e) {
                errHandler(e);
            }
		},
		click: function() {
			try{
                //is IE - cannot use webWorker method, oh well
                console.log("main: browser is IE: will use single-thread method.");
                this.showLoading();
            } catch (e) {
                errHandler(e);
            }
		},
		showLoading: function() {
			bootbox.confirm({
				title: "<span style='font-size: 24px'>This might take a while...</span>",
				message: "The process of generating a protocol can take up to about a minute (and sometimes longer on slow computers) when using Internet Explorer. <br><br><b>During this time your browser may appear to be unresponsive</b><br><br>Use a newer browser such as Chrome, Firefox or Edge for a much faster experience.",
				buttons: {
					cancel: {
						label: '<i class="fa fa-times"></i> Cancel'
					},
					confirm: {
						label: '<i class="fa fa-check"></i> Continue'
					}
				},
				backdrop: true,
				size: "large",
				callback: function (result) {
					if (result===true){
                        try{
						    generate.internetExplorer.generate(); //user has confirmed they want to proceed despite slow process on IE
                        } catch (e) {
                            errHandler(e);
                        }
					}
				}
			});
		},
		generate: function(){
			console.log("Starting generate process for IE");
			const docDef = getDocDef(inputs, calcVars); //generates the document definition using inputs and documentVariables
			pdfMake.createPdf(docDef).download("DKA Protocol for "+inputs.name+".pdf"); //generate from the created docdefinition and trigger download
			console.log("Finished generate process for IE");
		}
	}
}





