<!DOCTYPE html>
<html lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Paediatric DKA Protocol Generator - Start Page</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description=" content="Paediatric DKA Calculator - Use this tool to generate an integrated care pathway for managing paediatric diabetic ketoacidosis based on the BSPED 2020 Guidelines. It will pre-fill calculations in the pathway based on the values for your patient.">
	<?php include 'php-1.1.10/indexDependencies.php';?> <!--includes the dependencies required for this page including favicon, bootstrap, javascript file, moment, date/time picker, popover and unique ID generator-->
	<?php include 'php-1.1.10/loader.php';?> <!--includes the loader which displays until page is ready-->
</head>
<body>
	<div class="loader"></div> <!--this div required for php/loader.php to work-->
	<div class="container">
		<?php include 'php-1.1.10/jumbotron.php';?> <!--includes the header file-->
		<form> <!--This first form contains confidential information that is not submitted to the server-->
			<div class="panel panel-danger"> 
		        <div class="panel-heading">
		            This is the legacy version (v1.1.10) of the DKA Calculator.
		        </div>
				<div class="panel-body">
				    <div class="row">
						<div class="col-sm-12">
						    <p>The DKA Calculator was updated in response to the latest <a href="https://www.bsped.org.uk/clinical-resources/guidelines/#diabetes" _target="blank" rel="noopener">BSPED DKA Guidelines</a>. This legacy version is provided for a 6 month transition period and will be removed in April 2022.<br><br><a href="/">Click here to access the most up to date version of the calculator</a>.
						</div>
					</div>
				</div>
			</div>
			<div class="panel panel-default"> <!--panel for advisory notes-->
				<div class="panel-body">
					<div class="row">
						<div class="col-sm-12">
							<p>Complete the form below. You can hover over the icons (e.g. 
								<a href="#" tabindex="-1" data-toggle="tooltip" title=""><i class="glyphicon glyphicon-user"></i></a>
								) at the left of each input box for more guidance. Once each input is completed successfully it will be highlighted in green. After you press submit, if there is a problem with an entry, it will be highlighted in red and an explanatory note will appear to the right.
								</br></br>For information about how the data is used, hover over the 
								<a href="#" tabindex="-1" data-toggle="tooltip" title="" data-content=""><span class="glyphicon glyphicon-info-sign"></span></a>
								for that section. Once the form is complete click the submit button. The generated protocol will be ready to download within a few seconds. If you encounter problems, a backup version of the ICP (without pre-filled calculations) can be downloaded from
								<a href="https://dka-calculator.co.uk/DKA-ICP-2020.pdf" tabindex="-1" title="Backup ICP."> here.</a>
								<br><br>If you would like to use the calculator for training or testing purposes, please be sure to select "[Testing]" for region, to allow differentiation from real patient data.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="progress">
				<div id="progBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="90" style="width:0%"></div>
			</div>	
			<div class="panel panel-default"> <!--section one contains patient demographics-->
				<div class="panel-heading">Patient demographics <a href="#" tabindex="-1" data-toggle="tooltip" title="To protect patient confidentiality, data entered into this section is not transmitted or stored. It is used to mark the generated protocol with the patient's demographics."><span class="glyphicon glyphicon-info-sign"></span></a> </div>
				<div class="panel-body">
					<div class="row"> <!--first row has patient name input-->
						<div class="col-sm-7">
							<div id="div_name" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patients full name."><i class="glyphicon glyphicon-user"></i></a></span> <!--the glyphicon with popover at far left of row-->
								<span class="input-group-addon" style="width:210px;text-align:left"> Full name</span> <!--the text label for the input-->
								<input id="name" type="text" autocomplete="off" class="form-control" name="name" onBlur="checkProgress('name')"/> <!--the input field itself, calls check function when focus leaves the input field-->
								<div id="div_name_glyph"></div> <!--the div into which the tick or cross marker is placed after the check function for this input runs-->
							</div>
						</div>
						<div id="div_name_info" class="col-sm-5" style="color:red"></div> <!--the div into which the advisory note is placed if the check function fails-->
					</div>
					<div class="row"> <!--DOB-->
						<div class="col-sm-7">
							<div id="div_dob" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patients date of birth using the date picker, or the format dd/mm/yyyy."><i class="glyphicon glyphicon-calendar"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Date of birth</span>
								<input id="dob" type="text" autocomplete="off" class="form-control datepicker-here" data-language="en" data-date-format="dd/mm/yyyy" name="dob" onBlur="checkProgress('dob')"/> <!--uses datepicker set for date only, check function for dob also calls check function for age-->
								<div id="div_dob_glyph"></div>
							</div>
						</div>
						<div id="div_dob_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--Hospital/NHS-->
						<div class="col-sm-7">
							<div id="div_num" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patients hospital or NHS number."><i class="glyphicon glyphicon-tag"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Hospital/NHS number</span>
								<input id="num" type="text" autocomplete="off" class="form-control" name="num" onBlur="checkProgress('num')">
								<div id="div_num_glyph"></div>
							</div>
						</div>
						<div id="div_num_info" class="col-sm-5" style="color:red"></div>
					</div>
				</div>
			</div>
		</form>
		<form id="protocolForm" method="post" action="submit-legacy.php"> <!--This second form contains the non-confidential information that IS submitted to the server and logged-->
			<div class="panel panel-default">
				<div class="panel-heading">Protocol variables <a href="#" tabindex="-1" data-toggle="tooltip" title="Data entered into this section is used for calculation of relevant values in the generated protocol. These values are stored for audit purposes."><span class="glyphicon glyphicon-info-sign"></span></a></div>
				<div class="panel-body">
					<div class="row"> <!--Protocol start date/time-->
						<div class="col-sm-7">
							<div id="div_protocolStart" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the date and time the decision to start the patient on the DKA protocol using the date/timer picker, or the format dd/mm/yyyy hh:mm."><i class="glyphicon glyphicon-time"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Protocol start date/time</span>
								<input id="protocolStart" type="text" autocomplete="off" class="form-control datepicker-here" data-timepicker="true" data-date-format="dd/mm/yyyy" data-time-format='hh:ii' data-language="en" name="protocolStart" onBlur="checkProgress('protocolStart')">
								<div id="div_protocolStart_glyph"></div>
							</div>
						</div>
						<div id="div_protocolStart_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--sex-->
						<div class="col-sm-7">
							<div id="div_sex" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please select the patients sex (for transgender patients use birth/physiological sex)"><i class="glyphicon glyphicon-unchecked"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Sex</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="sex" name="sex" onBlur="checkProgress('sex')">
									<option value="1">Select option:</option>
									<option value="2">Female</option>
									<option value="3">Male</option>
								  </select>
								</div> 
								<div id="div_sex_glyph"></div>
							</div>
						</div>
						<div id="div_sex_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--Age-->
						<div class="col-sm-7">
							<div id="div_age" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Patients age is calculated automatically from date of birth."><i class="glyphicon glyphicon-hourglass"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Age</span>
								<input id="age" type="text" autocomplete="off" class="form-control" name="age" readonly> <!-- is read-only as this value derived during check function for dob-->
								<div id="div_age_glyph"></div>
							</div>
						</div>
						<div id="div_age_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--Weight-->
						<div class="col-sm-7">
							<div id="div_weight" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patients weight in kilograms, for protocol calculations."><i class="glyphicon glyphicon-scale"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Weight (kg)</span>
								<input id="weight" type="number" autocomplete="off" class="form-control" name="weight" onBlur="checkProgress('weight')">
								<div id="div_weight_glyph"></div>
							</div>
						</div>
						<div id="div_weight_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row" id="override" style="display:none"> <!--Override row is hidden on start and made visible by check function for weight if outside safe range. If then ticked then check function for weight will always pass-->
						<div class="col-sm-7 col-md-offset-3">
						    <div class="checkbox"><input id="overrideCheckbox" name="overrideCheckbox" type="checkbox" value=1 onclick="checkProgress('weight')">Override weight safety range?</div>
                        </div>
					</div>
					<div class="row"> <!--pH-->
						<div class="col-sm-7">
							<div id="div_pH" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patients blood pH for protocol calculations."><i class="glyphicon glyphicon-tint"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> pH</span>
								<input id="pH" type="number" autocomplete="off" class="form-control" name="pH" onBlur="checkProgress('pH')">
								<div id="div_pH_glyph"></div>
							</div>
						</div>
						<div id="div_pH_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--shocked?-->
						<div class="col-sm-7">
							<div id="div_shock" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Is the patient receiving rapid boluses for shock?"><i class="glyphicon glyphicon-exclamation-sign"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Patient shocked?</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="shock" name="shock" onBlur="checkProgress('shock')">
									<option value="1">Select option:</option>
									<option value="2">No - slow 10ml/kg bolus subtracted from deficit</option>
									<option value="3">Yes - rapid bolus(es) not subtracted from deficit</option>
								  </select>
								</div> 
								<div id="div_shock_glyph"></div>
							</div>
						</div>
						<div id="div_shock_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--insulin rate?-->
						<div class="col-sm-7">
							<div id="div_insulin" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="What starting insulin infusion rate is planned for use in this patient?"><i class="glyphicon glyphicon-dashboard"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Insulin infusion rate?</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="insulin" name="insulin" onBlur="checkProgress('insulin')">
									<option value="1">Select option:</option>
									<option value="2">0.05 units/kg/hour (default)</option>
									<option value="3">0.1 units/kg/hour</option>
								  </select>
								</div> 
								<div id="div_insulin_glyph"></div>
							</div>
						</div>
						<div id="div_insulin_info" class="col-sm-5" style="color:red"></div>
					</div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">Audit variables <a href="#" tabindex="-1" data-toggle="tooltip" title="Variables here are collected as part of the national DKA audit programme. The audit ID is shown on the generated protocol and also stored for subsequent audit linkage."><span class="glyphicon glyphicon-info-sign"></span></a> </div>
				<div class="panel-body">
					<div class="row"> <!--Pre-existing diabetes?-->
						<div class="col-sm-7">
							<div id="div_preDM" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Was the patient previously known to have diabetes?"><i class="glyphicon glyphicon-flag"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Pre-existing diabetes?</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="preDM" name="preDM" onBlur="checkProgress('preDM')">
									<option value="1">Select option:</option>
									<option value="2">No - newly diagnosed presenting in DKA</option>
									<option value="3">Yes - pre-existing diagnosis of diabetes</option>
								  </select>
								</div> 
								<div id="div_preDM_glyph"></div>
							</div>
						</div>
						<div id="div_preDM_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--Region-->
						<div class="col-sm-7">
							<div id="div_region" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please select the region of the treating centre."><i class="glyphicon glyphicon-bed"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Diabetes Network Region</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="region" name="region" onchange="checkProgress('region')"> <!--the check function for region will populate the drop-down menu for centre-->
									<option value="1">Select region from list:</option>
									<option value="2">Northern Ireland</option>
									<option value="3">Scotland</option>
									<option value="4">Wales</option>
									<option value="5">East Midlands</option>
									<option value="6">East of England</option>
									<option value="7">North East and North Cumbria</option>
									<option value="8">North West</option>
									<option value="9">South East Coast and London Partnership</option>
									<option value="10">South West</option>
									<option value="11">Thames Valley</option>
									<option value="12">Wessex</option>
									<option value="13">West Midlands</option>
									<option value="14">Yorkshire and Humber</option>
									<option value="15">[Testing]</option>
								  </select>
								</div>
								<div id="div_region_glyph"></div>
							</div>
						</div>
						<div id="div_region_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--Centre-->
						<div class="col-sm-7">
							<div id="div_centre" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please select the treating centre."><i class="glyphicon glyphicon-bed"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Treating centre</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="centre" name="centre" onBlur="checkProgress('centre')">
								 	 <option value="0">Select region first.</option> <!--the remaining options are added by the check function for region-->
								  </select>
								</div>
								<div id="div_centre_glyph"></div>
							</div>
						</div>
						<div id="div_centre_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--AuditID-->
						<div class="col-sm-7">
							<div id="div_auditID" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please press the 'Generate audit ID' button to create a unique ID for audit data linkage."><i class="glyphicon glyphicon-tags"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Audit ID</span>
								<input id="auditID" type="text" autocomplete="off" class="form-control" name="auditID" readonly> <!--read-only as this input filled by the add_auditID function-->
							<div id="div_auditID_glyph"></div>
							</div>
						</div>
						<div class="col-sm-2">
							<button id="generate" type="button" class="btn btn-block btn-success" onclick="add_auditID()">Generate audit ID</button> <!--button click calls the add_auditID function which is found below-->
						</div>
						<div id="div_auditID_info" class="col-sm-3" style="color:red"></div>
					</div>
					<div style="display:none"> <!--datetime of client browser gets placed in this hidden input field for posting after submit click-->
						<input id="client_DT" type="text" class="form-control" name="client_DT">
					</div>
					<div style="display:none"> <!--navigator.userAgent getss placed in this hidden input field for posting after submit click, allows later analysis of which browsers being used to access site-->
						<input id="client_uA" type="text" class="form-control" name="client_uA">
					</div> 
				</div>
			</div>
			<div id="warn"></div> <!--warning banner placed into this div if not all inputs pass their checks on clicking submit-->
			<!-- Joe Bloggs button goes here for testing-->
			<div class="row"> <!--Submit button-->
				<div class="col-sm-6 col-md-offset-3">
					<button type="button" id="btnsubmit" class="btn btn-primary btn-block">Submit</button>
				</div>
			</div>		
		</form>
		</br>
		<?php include 'php-1.1.10/footer.php';?> <!--includes footer file-->
	</div>
	<script>
	    //this function must be in the php file not js as it requires the unique ID which is echo'd during php running on server side-->
		function add_auditID(){
			document.getElementById('auditID').value = "<?php echo $unique_id ?>";
			document.getElementById('generate').classList.add("disabled");
			checkProgress('auditID');
		}
	</script>
</body>
</html>
