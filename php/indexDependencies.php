<!--this file contains the dependencies that are required for index.php-->

<!--favicon-->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

<!--bootstrap styling-->
<link rel="stylesheet" href="externalDependencies/bootstrap-3.4.1-dist/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="externalDependencies/bootstrap-3.4.1-dist/js/bootstrap.min.js"></script>

<!--my scripts-->
<script src="js-1.1.9/indexComponents/regionHospitals.js"></script>
<script src="js-1.1.9/indexComponents/weightLimits.js"></script>
<script src="js-1.1.9/index.js"></script>
<script src="js-1.1.9/disclaimer.js"></script>

<!--moment-->
<script src="externalDependencies/moment/moment.min.js"></script>

<!--date/time pickers-->
<link href="externalDependencies/air-datepicker-2.2.3/css/datepicker.min.css" rel="stylesheet" type="text/css">
<script src="externalDependencies/air-datepicker-2.2.3/js/datepicker.min.js"></script>
<script src="externalDependencies/air-datepicker-2.2.3/js/i18n/datepicker.en.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js"></script>

<!--popovers and tooltips-->
<script>
	$(document).ready(function(){
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip(); 
	});
</script>

<!--bootbox -->
<script src="externalDependencies/bootbox/bootbox.min.js"></script>
<script src="externalDependencies/bootbox/bootbox.locales.min.js"></script>

<!--unique ID from backend-->
<?php $unique_id = uniqid('', true); ?>
<script>
    //this function must be in the php file not js as it requires the unique ID which is echo'd during php running on server side-->
	function add_auditID(){
		document.getElementById('auditID').value = "<?php echo $unique_id ?>";
		document.getElementById('generate').classList.add("disabled");
		checkProgress('auditID');
	}
</script>