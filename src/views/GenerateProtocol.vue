<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import { config } from "../assets/config.js";
import Swal from "sweetalert2";
import router from "../router";
import { api } from "@/assets/api.js";
import { getDocDef } from "@/assets/docDef.js";

const generate = {
	click: function() { //runs on user clicking generate protocol
        this.internetExplorer.generate()
        return
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
                        } catch (error) {
                            console.error(error);
                        }
                    }
                };
            } catch (error) {
                console.error(error);
            }
        }
	},
	showLoading: function() { //shows a loading modal until the PDF generation is finished
		console.log('to do - show loading')
	},
	startWebWorker: function(){ //launches the web worker that will generate the PDF blob
		console.log('main: starting webWorker.js...');
		const myWorker = new Worker('js-1.3.6/submitComponents/webWorker.js'); //start instance of webWorkerPDF.js
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
			const docDef = getDocDef(); //generates the document definition using inputs and documentVariables
      console.log(docDef)
			pdfMake.createPdf(docDef).download("DKA Protocol for "+inputs.name+".pdf"); //generate from the created docdefinition and trigger download
			console.log("Finished generate process for IE");
		}
	}
}

const fetchCalculations = () => {
  let payload = {}
  for (let input in data.value.inputs) payload[input] = data.value.inputs[input].val
  delete payload.patientName
  delete payload.patientHospNum
  
  payload.patientAge = data.value.inputs.patientDOB.patientAge.val
  payload.weightLimitOverride = data.value.inputs.weight.limit.override
  payload.appVersion = config.version
  payload.clientDatetime = new Date();
  payload.clientUseragent = navigator.userAgent
  console.log(payload)
  //replace data.value.demoInputs with payload
  /*api('fetchCalculations', data.value.demoInputs)
    .then(
      function (res) {
        data.value.auditID = res.auditID
        data.value.calculations = res.calculations
      },
      function (error) {
        Swal.fire({
          html: error
        })
      }
    )*/
  generate.click()

}

onMounted(() => {
  /*if (!data.value.form.isValid(3)) {
    router.push("/form-audit-details");
  } else {
    fetchCalculations()
  }*/
  fetchCalculations()
});
</script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Generate protocol</h2>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-outline-secondary {
  width: 150px;
}
</style>
