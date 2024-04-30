<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import { config } from "../assets/config.js";
import Swal from "sweetalert2";
import router from "../router";
import { api } from "@/assets/api.js";

let payload = {}

const generate = {
	start: function() {
    try{
        let myWorker = this.startWebWorker();
        myWorker.onmessage = function(res) { //once response received from webWorker triggers download of pdf
            if(res.data.stack){ //if res.data.stack is defined then it's an error being returned by web worker so pass res.data to errHandler
                console.error(res.data);
            } else { //otherwise use the returned blob to create the download
                try{
                    generate.handleWorkerResponse(res);
                } catch (error) {
                    console.error(error);
                }
            }
        };
    } catch (error) {
        console.error(error);
    }
	},
	startWebWorker: function(){ //launches the web worker that will generate the PDF blob
		console.log('main: starting webWorker.js...');
		const myWorker = new Worker(new URL('@/assets/webWorker.js', import.meta.url),{type: 'module'}); //start instance of webWorkerPDF.js
    myWorker.postMessage(JSON.parse(JSON.stringify(
      {
        patientName: data.value.inputs.patientName.val,
        patientDOB: data.value.inputs.patientDOB.val,
        patientNHS: data.value.inputs.patientNHS.val,
        patientHospNum: data.value.inputs.patientHospNum.val,
        weight: data.value.inputs.weight.val,
        override: data.value.inputs.weight.limit.override,
        pH: data.value.inputs.pH.val,
        shockPresent: data.value.inputs.shockPresent.val,
        preExistingDiabetes: data.value.inputs.preExistingDiabetes.val,
        patientSex: data.value.inputs.patientSex.val,
        insulinRate: data.value.inputs.insulinRate.val,
        protocolStartDatetime: data.value.inputs.protocolStartDatetime.val,
        calculations: data.value.calculations,
        auditID: data.value.auditID
      }
    ))); 
		console.log('main: request sent to webWorker.js...');
		return myWorker;
	},
	handleWorkerResponse: function(res){ //takes the 
		console.log('main: response received from webWorker.js...');
		// Automatically start file download
		const anchor = document.createElement('a');
		document.body.appendChild(anchor);
		anchor.href = window.URL.createObjectURL(res.data.pdfBlob);
		anchor.download = 'DKA Protocol for '+data.value.inputs.patientName.val+'.pdf';
		anchor.click();
		console.log('main: pdf download triggered...');
		this.success();
	},
	success: function(){ //show the success modal
		console.log('success to do')
	},
}

const fetchCalculations = () => {
  for (let input in data.value.inputs) payload[input] = data.value.inputs[input].val
  delete payload.patientName
  delete payload.patientHospNum
  
  payload.patientAge = data.value.inputs.patientDOB.patientAge.val
  payload.weightLimitOverride = data.value.inputs.weight.limit.override
  payload.appVersion = config.version
  payload.clientDatetime = new Date();
  payload.clientUseragent = navigator.userAgent
  console.log(payload)
  api('fetchCalculations', payload)
    .then(
      function (res) {
        data.value.auditID = res.auditID
        data.value.calculations = res.calculations
        generate.start()
      },
      function (error) {
        Swal.fire({
          html: error
        })
      }
    )
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
    <p><span class="spinner-border" role="status"></span>Please wait whilst the care pathway for {{data.inputs.patientName.val}} is generated...</p>
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
