<!--this file contains the dependencies that are required for submit.php-->

<!--favicon-->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

<!--bootstrap styling-->
<link rel="stylesheet" href="externalDependencies/bootstrap-3.4.1-dist/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="externalDependencies/bootstrap-3.4.1-dist/js/bootstrap.min.js"></script>

<!--moment-->
<script src="externalDependencies/moment/moment.min.js"></script>

<!--pdfmake -->
<script src="externalDependencies/pdfmake/pdfmake.js"></script>
<script src="externalDependencies/pdfmake/pdfmake.min.js"></script>
<script src="externalDependencies/pdfmake/vfs_fonts.js"></script>

<!--my scripts-->
<script src="js-1.1.10/submitComponents/inputs.js"></script>
<script src="js-1.1.10/submitComponents/imageStore.js"></script>
<script src="js-1.1.10/submitComponents/documentVariables.js"></script>
<script src="js-1.1.10/submitComponents/documentDefinition.js"></script>
<script src="js-1.1.10/submitComponents/showWorking.js"></script>
<script src="js-1.1.10/submit.js"></script>

<!--bootbox -->
<script src="externalDependencies/bootbox/bootbox.min.js"></script>
<script src="externalDependencies/bootbox/bootbox.locales.min.js"></script>

<!--popovers and tooltips-->
<script>
	$(document).ready(function(){
	$('[data-toggle="popover"]').popover();
	$('[data-toggle="tooltip"]').tooltip(); 
	});
</script>
