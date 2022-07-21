<!DOCTYPE html>
<html lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Paediatric DKA Protocol Generator - Start Page</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description=" content="Paediatric DKA Calculator - Use this tool to generate an integrated care pathway for managing paediatric diabetic ketoacidosis based on the BSPED 2020 Guidelines. It will pre-fill calculations in the pathway based on the values for your patient.">
	<!--favicon-->
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="../site.webmanifest">

	<!--bootstrap styling-->
	<link rel="stylesheet" href="/externalDependencies/bootstrap-3.4.1-dist/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script src="/externalDependencies/bootstrap-3.4.1-dist/js/bootstrap.min.js"></script>
	<style>
		.loader {
			position: fixed;
			left: 0px;
			top: 0px;
			width: 100%;
			height: 100%;
			z-index: 9999;
			background: url('/images/pageLoader.gif') 50% 50% no-repeat rgb(255,255,255);
			opacity: 1;
		}
	</style>

	<script type="text/javascript">
		$(window).on("load", function (e) {
			setTimeout(function(){
				$(".loader").fadeOut("slow");
			}, 1000);
		});
	</script>
</head>
<body>
	<div class="loader"></div> <!--this div required for php/loader.php to work-->
	<div class="container">
		<?php include '../php-1.3.4/jumbotron.php';?> <!--includes the header file-->
		<form> <!--This first form contains confidential information that is not submitted to the server-->
			<div class="panel panel-danger"> 
		        <div class="panel-heading">
		            This is the legacy version (v1.1.10) of the DKA Calculator.
		        </div>
				<div class="panel-body">
				    <div class="row">
						<div class="col-sm-12">
						    <p>The DKA Calculator was updated in response to the latest <a href="https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/" _target="blank" rel="noopener">BSPED DKA Guidelines</a>. The legacy version was provided for a 6 month transition period and has now been retired.<br><br><a href="/">Click here to access the most up to date version of the calculator</a>.
						</div>
					</div>
				</div>
			</div>
		</form>
		</br>
		<?php include '../php-1.3.4/footer.php';?> <!--includes footer file-->
	</div>
</body>
</html>
