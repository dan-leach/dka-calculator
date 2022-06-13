<!DOCTYPE html>
<html>
<head>
	<title>Paediatric DKA Calculator</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php include 'php-1.3.3/submitDependencies.php';?>	<!--includes the dependencies required for this page including favicon, bootstrap, javascript files, moment, pdfmake and popovers-->
	<?php include 'php-1.3.3/loader.php';?> <!--includes the loader which displays until page is ready-->
</head>
<body>
	<div class="loader"></div> <!--this div required for php/loader.php to work-->
	<div class="container">
		<?php include 'php-1.3.3/jumbotron.php';?> <!--includes the header file-->
		<div class="panel panel-default">
			<div class="panel-heading">Your form has been submitted. <a href="#" tabindex="-1" data-toggle="popover" title="" data-content="If the audit data has stored successfully this should be indicated below."><span class="glyphicon glyphicon-info-sign"></span></a> </div>
			<div class="panel-body">
				<div class="row">
					<div class="col-sm-12">
						<?php
							// assign PHP variables from POST
							if( isset($_POST['protocolStart']) ){
								$pprotocolStart = $_POST['protocolStart'];
							} else {
								die("No data was received by the server.");
							}
							$psex = $_POST['sex'];
							$page = $_POST['age'];
							$pweight = $_POST['weight'];
							if( isset($_POST['overrideCheckbox']) ){
								$poverride = $_POST['overrideCheckbox'];
								if ($poverride == "1"){
									$poverride = 1;
								} else {
									$poverride = 0;
								};
							} else {
								$poverride = 0;
							}
							$ppH = $_POST['pH'];
							$pshock = $_POST['shock'];
							$pinsulin = $_POST['insulin'];
							$ppreDM = $_POST['preDM'];
							$pregion = $_POST['region'];
							$pcentre = $_POST['centre'];
							$pepisode = $_POST['episode'];
							$pauditID = $_POST['auditID'];
							$pclient_DT = $_POST['client_DT'];
							$pclient_uA = $_POST['client_uA'];
							$pclient_IP = $_SERVER['REMOTE_ADDR'];
							
							$calc_Version = "'1.3.3'";

							//this section commented out but can be activated for debugging variables
							/*
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
							echo "<hr>";
							*/

							// Attempt MySQL server connection.
							require 'php-1.3.3/link.php';
							
							// Check connection
							if($link === false) die("Audit data could not be logged. The server returned the following error message: " . mysqli_connect_error());

							// Check audit ID not previously submitted
							$result = $link->query("SELECT auditID FROM calculator_table WHERE auditID = '$pauditID'");
							if ($result->num_rows > 0){
								die("Audit data could not be logged. The audit ID submitted already exists in the database.");
							}

							// Prepare insert 
							$stmt = $link->prepare("INSERT INTO calculator_table (protocolStart, sex, age, weight, override, pH, shock, insulin, preDM, region, centre, episode, auditID, client_DT, client_uA, client_IP, calc_Version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
							if ( false===$stmt ) die("Audit data could not be logged. The server returned the following error message: prepare() failed: " . mysqli_error($link));

							// Bind parameters
							$rc = $stmt->bind_param("sssssssssssssssss", $pprotocolStart, $psex, $page, $pweight, $poverride, $ppH, $pshock, $pinsulin, $ppreDM, $pregion, $pcentre, $pepisode, $pauditID, $pclient_DT, $pclient_uA, $pclient_IP, $calc_Version);
							if ( false===$rc ) die("Audit data could not be logged. The server returned the following error message: bind_param() failed: " . mysqli_error($link));

							// Execute the prepared insert statment
							$rc = $stmt->execute();
							if ( false===$rc ) die("Audit data could not be logged. The server returned the following error message: execute() failed: " . mysqli_error($link));

							$stmt->close();
							mysqli_close($link);

						?>

						<!--adds the generate pdf button and advisory notes. the generateDiv is edited by functions within js/generatePDF.js to show relevant messages-->
						<div class='alert alert-success'>Audit data logged successfully (not including patient demographics).</div>
						<div class='row'>
							<div class='col-md-4 col-md-offset-1'>
								<button type='button' class='btn btn-info btn-lg btn-block' onClick='showWorking.click()'>View calculation working  <span class='glyphicon glyphicon-zoom-in'></span></button>
							</div>
							<div class='col-md-4 col-md-offset-1'>
								<button type='button' class='btn btn-primary btn-lg btn-block' onClick='generate.click()'>Generate Protocol  <span class='glyphicon glyphicon-download-alt'></span></button>
							</div>
						</div>
						<div id='ieMessageDiv'></div>
						<div id='generateDiv'></div>						
						<br><br><a href="/">Click here</a> to generate a new protocol.
						<br><br>If you are encountering problems with the protocol generator, you can download a blank copy of the protocol by <a href="https://dka-calculator.co.uk/DKA-ICP-2021.pdf">clicking here</a>, or by visiting the <a href="https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/">BSPED website</a>.
						
					</div>
				</div>
			</div>
			<?php include 'php-1.3.3/footer.php';?> <!-- includes the footer file-->
		</div>
	</div>
</body>
</html>