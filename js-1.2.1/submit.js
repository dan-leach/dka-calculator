//ensures that if page refreshed will simply reload start page rather than reloading submit and causing errors
//history.replaceState(null, "", "/");

const generate = {
	click: function() {
		if (this.internetExplorer.detect()){
			this.internetExplorer.click();
		} else {
			console.log("main: browser is not IE: will use webWorker method.");
			//for any browser other than IE - uses web worker method which is preferred as prevents browser appearing unresponsive during pdfmake process. Cannot do this for IE as it will not allow passing blob back from webworker.
			var dialog = this.showLoading();
			var myWorker = this.startWebWorker();
			//once response received from webWorker triggers download of pdf
			myWorker.onmessage = function(res) {
				if(typeof(res.data.err)=="object"){
					errHandler(res.data.err, res.data.trigger);
				} else {
					generate.handleWorkerResponse(res);
					dialog.modal('hide');
				}
			};
		}
	},
	showLoading: function() {
		var dialog = bootbox.dialog({
			message: '<div class="panel panel-primary" style="text-align:center;"><div class="panel-heading">Please wait while the protocol is being generated...</div><div class="panel-body"><div class="row"><div class="col-sm-12"><i class="fa fa-spin fa-cog"></i><img src="/images/pageLoader.gif" alt="Loading..." style="display:block; margin-left:auto; margin-right:auto;" class="img-responsive"></div></div></div><div class="panel-footer">This can take up to a minute.</div></div>',
			closeButton: false,
		});
		return dialog;
	},
	startWebWorker: function(){
		//start instance of webWorkerPDF.js
		console.log('main: starting webWorker.js...');
		const myWorker = new Worker('js-1.2.1/submitComponents/webWorker.js');
		//passes input data to webWorkerPDF.js
		myWorker.postMessage(inputs);
		console.log('main: request sent to webWorker.js...');
		return myWorker;
	},
	handleWorkerResponse: function(res){
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
	success: function(){
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
	internetExplorer: {
		detect: function() { //returns true if browser is IE, otherwise returns false
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf('MSIE ');
			if (msie > 0) return true; // IE 10 or older
			var trident = ua.indexOf('Trident/');
			if (trident > 0) return true; // IE 11
			return false; //other browser
		},
		click: function() {
			//is IE - cannot use webWorker method, oh well
			console.log("main: browser is IE: will use single-thread method.");
			this.showLoading();
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
						generate.internetExplorer.generate();
					}
				}
			});
		},
		generate: function(){
			console.log("Starting generate process for IE");
		
			//perfoms the calculations to derive the variables printed into the document and set positions of dynamic indicator boxes
			const calcVars = getCalcVars(inputs);
		
			//generates the document definition using inputs and documentVariables
			const docDef = getDocDef(inputs, calcVars);
		
			//generate from the created docdefinition and trigger download
			pdfMake.createPdf(docDef).download("DKA Protocol for "+inputs.name+".pdf");
			
			//changes generateDiv contents once download triggered
			//$("#generateDiv").html("<br><button type='button' id='' class='btn btn-success btn-block'>The DKA protocol for "+inputs.name+" should start downloading shortly...</button>");
			
			//removes stored form inputs from memory
			console.log("Finished generate process for IE");
		}
	}
}






