<!DOCTYPE html>
<html>
<head>
	<title>Paediatric DKA Protocol Generator - Form Submitted</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php include 'php/submitDependencies.php';?>	<!--includes the dependencies required for this page including favicon, bootstrap, javascript files, moment, pdfmake and popovers-->
	<?php include 'php/loader.php';?> <!--includes the loader which displays until page is ready-->

	<style>
		table, th, td {
		border: 1px solid black;
		}
		th, td {
		padding: 10px;
		}
	</style>

</head>
<body>
	<div class="loader"></div> <!--this div required for php/loader.php to work-->
	<div class="container">
		<?php include 'php/jumbotron.php';?> <!--includes the header file-->
		<div class="panel panel-success">
			<div class="panel-heading">Your form has been submitted. <a href="#" tabindex="-1" data-toggle="popover" title="" data-content="If the audit data has stored successfully this should be indicated below."><span class="glyphicon glyphicon-info-sign"></span></a> </div>
			<div class="panel-body">
				<div class="row">
					<div class="col-sm-12">
						<?php
						// assign PHP variables from POST - where required quote marks are added around the original variable to prevent errors on SQL insert
						$pprotocolStart = "'" . $_POST['protocolStart'] . "'";
						$psex = $_POST['sex'];
						$page = $_POST['age'];
						$pweight = $_POST['weight'];
						$poverride = $_POST['overrideCheckbox'];
							if ($poverride == "1"){
								$poverride = 1;
							} else {
								$poverride = 0;
							};
						$ppH = $_POST['pH'];
						$pshock = $_POST['shock'];
						$pinsulin = $_POST['insulin'];
						$ppreDM = $_POST['preDM'];
						$pregion = $_POST['region'];
						$pcentre = "'" . $_POST['centre'] . "'";
						$pauditID = "'" . $_POST['auditID'] . "'";
						$pclient_DT = "'" . $_POST['client_DT'] . "'";
						$pclient_uA = "'" . $_POST['client_uA'] . "'";
						$pclient_IP = "'" . $_SERVER['REMOTE_ADDR'] . "'";

						/* //this section commented out but can be activated for debugging variables
						echo "<br><br>The following data was submitted to the server:";
						echo "<br>Protocol start: " . $pprotocolStart;
						echo "<br>Sex: " . $psex;
						echo "<br>Age: " . $page;
						echo "<br>Weight: " . $pweight;
						echo "<br>OverrideCheckbox: " . $poverride;
						echo "<br>pH: " . $ppH;
						echo "<br>Shock: " . $pshock;
						echo "<br>Insulin: " . $pinsulin;
						echo "<br>PreDM: " . $ppreDM;
						echo "<br>Region: " . $pregion;
						echo "<br>Centre: " . $pcentre;
						echo "<br>AuditID: " . $pauditID;
						echo "<br>client_DT: " . $pclient_DT;
						echo "<br>client_IP: " . $pclient_IP;
						*/

						// Attempt MySQL server connection.
						$link = mysqli_connect("localhost", "dkacalcu_submit", "password", "dkacalcu_dka_database");
						 
						// Check connection
						if($link === false){
							die("Audit data could not be logged. The server returned the following error message: " . mysqli_connect_error());
						}
						
						// Attempt insert query execution
						$sql = "INSERT INTO calculator_table (id, protocolStart, sex, age, weight, override, pH, shock, insulin, preDM, region, centre, auditID, client_DT, client_uA, client_IP) VALUES (null, $pprotocolStart, $psex, $page, $pweight, $poverride, $ppH, $pshock, $pinsulin, $ppreDM, $pregion, $pcentre, $pauditID, $pclient_DT, $pclient_uA, $pclient_IP)";
						if(mysqli_query($link, $sql)){
						    //adds the generate pdf button and advisory notes. the generateDiv is edited by functions within js/generatePDF.js to show relevant messages
							echo "Audit data logged successfully (not including patient demographics).<div id='div_showWorking'><a id='click_showWorking' onclick='showWorking()' href='#'>Click here to show working for calculations.</a><br><br></div><div id='generateDiv'>Click the button below to generate the protocol:<br><button type='button' id='generatePDF' class='btn btn-primary btn-block'>Generate Protocol</button></div><div id='ieMessageDiv'></div>";
						} else{
							echo "Audit data could not be logged. The server returned the following error message: " . mysqli_error($link);
						}
						 
						// Close connection
						mysqli_close($link);

						?>
						
						<br><br><a href="https://dka-calculator.co.uk">Click here</a> to generate a new protocol.
						<br><br>If you are encountering problems with the protocol generator, you can download a blank copy of the protocol by <a href="https://dka-calculator.co.uk/DKA-ICP-2020.pdf">clicking here</a>, or by visiting the <a href="https://www.bsped.org.uk/clinical-resources/guidelines/">BSPED website</a>.</div>
						
					</div>
				</div>
			</div>
			<?php include 'php/footer.php';?> <!-- includes the footer file-->
		</div>
	</div>
</body>
</html>