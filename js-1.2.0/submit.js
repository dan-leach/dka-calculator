//ensures that if page refreshed will simply reload start page rather than reloading submit and causing errors
//history.replaceState(null, "", "/");

function detectIE() { //returns true if browser is IE, otherwise returns false
	var ua = window.navigator.userAgent;

	var msie = ua.indexOf('MSIE ');
	if (msie > 0) return true; // IE 10 or older

	var trident = ua.indexOf('Trident/');
	if (trident > 0) return true; // IE 11

	return false; //other browser
}

if (detectIE()===false){
	//for any browser other than IE - uses web worker method which is preferred as prevents browser appearing unresponsive during pdfmake process. Cannot do this for IE as it will not allow passing blob back from webworker.
	window.onload = function () {
		console.log("main: browser is not IE: will use webWorker method.");

		//sets up listener for generate pdf button
		const $button = document.getElementById('generatePDF');
		$button.addEventListener("click", function () {
			
			//loading modal
			var dialog = bootbox.dialog({
				message: '<div class="panel panel-primary" style="text-align:center;"><div class="panel-heading">Please wait while the protocol is being generated...</div><div class="panel-body"><div class="row"><div class="col-sm-12"><i class="fa fa-spin fa-cog"></i><img src="/images/pageLoader.gif" alt="Loading..." style="display:block; margin-left:auto; margin-right:auto;" class="img-responsive"></div></div></div><div class="panel-footer">This can take up to a minute.</div></div>',
				closeButton: false
			});

			//changes generateDiv contents once button pressed
			$("#generateDiv").html("<br><button type='button' id='' class='btn btn-primary btn-block' disabled>Please wait...</button>");

			var myWorker = startWebWorker();

			//once response received from webWorker triggers download of pdf
			myWorker.onmessage = function(res) {
				if(typeof(res.data.err)=="object"){
					errHandler(res.data.err, res.data.trigger);
				} else {
					handleWorkerResponse(res);
					dialog.modal('hide');
				}
			};
		
		});
	};
} else {
	//is IE - cannot use webWorker method, oh well
	window.onload = function () {
		console.log("main: browser is IE: will use single-thread method.");
		
		//sets up listener for generate pdf button
		const $button = document.getElementById('generatePDF');
		$button.addEventListener("click", function () {
			
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
						generatePDFforIE();
					}
				}
			});
		});
	};
}

function startWebWorker(){
	//start instance of webWorkerPDF.js
	console.log('main: starting webWorker.js...');
	const myWorker = new Worker('js-1.2.0/submitComponents/webWorker.js');

	//passes input data to webWorkerPDF.js
	myWorker.postMessage(inputs);
	console.log('main: request sent to webWorker.js...');

	return myWorker;
}

function handleWorkerResponse(res){
	console.log('main: response received from webWorker.js...');

	// Automatically start file download
	const anchor = document.createElement('a');
	document.body.appendChild(anchor);
	anchor.href = window.URL.createObjectURL(res.data.pdfBlob);
	anchor.download = 'DKA Protocol for '+inputs.name+'.pdf';
	anchor.click();
	console.log('main: pdf download triggered...');

	//changes generateDiv contents once download triggered
	$("#generateDiv").html("<br><button type='button' id='' class='btn btn-success btn-block'>The DKA protocol for "+inputs.name+" should now be downloading.</button>");

	//removes stored form inputs from memory
	sessionStorage.clear();
}

function generatePDFforIE(){
	console.log("Starting generate process for IE");

	//changes generateDiv contents once generate button pressed
	$("#generateDiv").html("<br><button type='button' id='generatePDF' class='btn btn-primary btn-block' disabled>Please wait...</button>");

	//perfoms the calculations to derive the variables printed into the document and set positions of dynamic indicator boxes
	const calcVars = getCalcVars(inputs);

	//generates the document definition using inputs and documentVariables
	const docDef = getDocDef(inputs, calcVars);

	//generate from the created docdefinition and trigger download
	pdfMake.createPdf(docDef).download("DKA Protocol - "+inputs.name+".pdf");
	
	//changes generateDiv contents once download triggered
	$("#generateDiv").html("<br><button type='button' id='' class='btn btn-success btn-block'>The DKA protocol for "+inputs.name+" should start downloading shortly...</button>");
	
	//removes stored form inputs from memory
	sessionStorage.clear();
	console.log("Finished generate process for IE");
}