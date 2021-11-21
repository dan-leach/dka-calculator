<!DOCTYPE html>
<html lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Paediatric DKA Calculator</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Paediatric DKA Calculator - Generate an integrated care pathway for managing paediatric diabetic ketoacidosis based on the BSPED 2021 Guidelines. It will pre-fill calculations in the pathway based on the values for your patient.">
	<?php include 'php-1.2.1/indexDependencies.php';?> <!--includes the dependencies required for this page including favicon, bootstrap, javascript file, moment, date/time picker, popover and unique ID generator-->
	<?php include 'php-1.2.1/loader.php';?> <!--includes the loader which displays until page is ready-->
</head>
<body>
	<div class="loader"></div> <!--this div required for php/loader.php to work-->
	<div class="container">
		<?php include 'php-1.2.1/jumbotron.php';?> <!--includes the header-->
		<form> <!--This first form contains confidential information that is not submitted to the server-->
		    <div class="panel panel-danger"> <!--remove this panel before launch-->
		        <div class="panel-heading">
		            THIS IS THE DEVELOPMENT VERSION OF THE DKA CALCULATOR - NOT FOR CLINICAL USE
		        </div>
				<div class="panel-body">
				    <div class="row">
						<div class="col-sm-12">
						    <p>An update to the BSPED DKA Guidelines is coming soon. This is the development testing platform for that update. Do not use this site for generating clinical protocols.<br><a href="/">Visit the live DKA Calculator instead.</a></p>
						</div>
					</div>
				</div>
			</div>
			<div class="panel panel-warning"> <!--panel for update notes - remove in April 2022-->
		        <div class="panel-heading">
		            The DKA Calculator has been updated.
		        </div>
				<div class="panel-body">
				    <div class="row">
						<div class="col-sm-12">
						    <p>These updates are in response to <a href="https://www.bsped.org.uk/clinical-resources/guidelines/#diabetes" target="_blank" rel="noopener"> the 2021 update to the BSPED Guideline for the Management of Children and Young People under the age of 18 years with Diabetic Ketoacidosis</a>.</p>
							<ul>
								<li>Deficit percentage for moderate DKA reduced from 7% to 5%</li>
								<li>1st resus bolus volume reduced from 20mL/kg to 10mL/kg</li>
								<li>Upper weight limit reduced from 80kg to 75kg</li>
								<li>Bolus volumes now capped at 750mL</li>
								<li>Deficit volume now capped at 7500mL for patients with 10% dehydration (severe DKA)</li>
								<li>Deficit volume now capped at 3750mL for patients with 5% dehydration (mild and moderate DKA)</li>
								<li>Maintenance volume now capped at 2600mL (reduced from 3000mL in previous version)</li>
								<li>Insulin rate now capped at 7.5 Units/hour if 0.1 Units/kg/hour selected</li>
								<li>Insulin rate now capped at 3.75 Units/hour if 0.05 Units/kg/hour selected</li>
							</ul>
							<p><a href="https://github.com/dan-leach/dka-calculator/blob/master/changelog.md" target="_blank" rel="noopener">View the full changelog on GitHub.</a></p>
							<p>Access to the legacy version (v1.1.10) of the DKA Calculator will be supported until April 2022. <a href="/index-legacy.php"> Access the legacy version here.</a></p>
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
								<br><br>For information about how the data is used, hover over the 
								<a href="#" tabindex="-1" data-toggle="tooltip" title="" data-content=""><span class="glyphicon glyphicon-info-sign"></span></a>
								for that section. Once the form is complete click the submit button. The generated protocol will be ready to download within a few seconds. If you encounter problems, a backup version of the ICP (without pre-filled calculations) can be downloaded from
								<a href="https://dka-calculator.co.uk/DKA-ICP-2020.pdf" tabindex="-1" title="Backup ICP."> here.</a>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="progress"> <!--progress bar-->
				<div id="progBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="90" style="width:0%"></div>
			</div>	
			<div class="panel panel-default"> <!--section one contains patient demographics-->
				<div class="panel-heading">Patient demographics <a href="#" tabindex="-1" data-toggle="tooltip" title="To protect patient confidentiality, data entered into this section is not transmitted or stored. It is used to mark the generated protocol with the patient's demographics."><span class="glyphicon glyphicon-info-sign"></span></a> </div>
				<div class="panel-body">
					<div class="row"> <!--name-->
						<div class="col-sm-7">
							<div id="div_name" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patient's full name."><i class="glyphicon glyphicon-user"></i></a></span> <!--the glyphicon with popover at far left of row-->
								<span class="input-group-addon" style="width:210px;text-align:left"> Full name</span> <!--the text label for the input-->
								<input id="name" type="text" autocomplete="off" class="form-control" name="name" onBlur="indexForm.inputs.name.blur()"/> <!--the input field itself, calls check function when focus leaves the input field-->
								<div id="div_name_glyph"></div> <!--the div into which the tick or cross marker is placed after the check function for this input runs-->
							</div>
						</div>
						<div id="div_name_info" class="col-sm-5" style="color:red"></div> <!--the div into which the advisory note is placed if the check function fails-->
					</div>
					<div class="row"> <!--DOB-->
						<div class="col-sm-7">
							<div id="div_dob" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patient's date of birth using the date picker, or the format dd/mm/yyyy."><i class="glyphicon glyphicon-calendar"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Date of birth</span>
								<input id="dob" type="text" autocomplete="off" class="form-control datepicker-here" data-language="en" data-date-format="dd/mm/yyyy" name="dob" onBlur="indexForm.inputs.dob.blur()"/> <!--uses datepicker set for date only, check function for dob also calls check function for age-->
								<div id="div_dob_glyph"></div>
							</div>
						</div>
						<div id="div_dob_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--Hospital/NHS-->
						<div class="col-sm-7">
							<div id="div_num" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patient's hospital or NHS number."><i class="glyphicon glyphicon-tag"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Hospital/NHS number</span>
								<input id="num" type="text" autocomplete="off" class="form-control" name="num" onBlur="indexForm.inputs.num.blur()">
								<div id="div_num_glyph"></div>
							</div>
						</div>
						<div id="div_num_info" class="col-sm-5" style="color:red"></div>
					</div>
				</div>
			</div>
		</form>
		<form id="protocolForm" method="post" action="submit.php"> <!--This second form contains the non-confidential information that IS submitted to the server and logged-->
			<div class="panel panel-default">
				<div class="panel-heading">Protocol variables <a href="#" tabindex="-1" data-toggle="tooltip" title="Data entered into this section is used for calculation of relevant values in the generated protocol. These values are stored for audit purposes."><span class="glyphicon glyphicon-info-sign"></span></a></div>
				<div class="panel-body">
					<div class="row"> <!--Protocol start date/time-->
						<div class="col-sm-7">
							<div id="div_protocolStart" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the date and time the decision to start the patient on the DKA protocol using the date/timer picker, or the format dd/mm/yyyy hh:mm."><i class="glyphicon glyphicon-time"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Protocol start date/time</span>
								<input id="protocolStart" type="text" autocomplete="off" class="form-control datepicker-here" data-timepicker="true" data-date-format="dd/mm/yyyy" data-time-format='hh:ii' data-language="en" name="protocolStart" onBlur="indexForm.inputs.protocolStart.blur()">
								<div id="div_protocolStart_glyph"></div>
							</div>
						</div>
						<div id="div_protocolStart_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--sex-->
						<div class="col-sm-7">
							<div id="div_sex" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please select the patient's sex (for transgender patients use birth/physiological sex)"><i class="glyphicon glyphicon-unchecked"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Sex</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="sex" name="sex" onBlur="indexForm.inputs.sex.blur()">
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
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Patient's age is calculated automatically from date of birth."><i class="glyphicon glyphicon-hourglass"></i></a></span>
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
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patient's weight in kilograms, for protocol calculations."><i class="glyphicon glyphicon-scale"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Weight (kg)</span>
								<input id="weight" type="number" autocomplete="off" class="form-control" name="weight" onBlur="indexForm.inputs.weight.blur()">
								<div id="div_weight_glyph"></div>
							</div>
						</div>
						<div id="div_weight_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row" id="override" style="display:none"> <!--Override row is hidden on start and made visible by check function for weight if outside safe range. If then ticked then check function for weight will always pass-->
						<div class="col-sm-7 col-md-offset-3">
						    <div class="checkbox"><input id="overrideCheckbox" name="overrideCheckbox" type="checkbox" value=1 onclick="indexForm.inputs.weight.blur()">Override weight safety range?</div>
                        </div>
					</div>
					<div class="row"> <!--pH-->
						<div class="col-sm-7">
							<div id="div_pH" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please enter the patient's blood pH for protocol calculations."><i class="glyphicon glyphicon-tint"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> pH</span>
								<input id="pH" type="number" autocomplete="off" class="form-control" name="pH" onBlur="indexForm.inputs.pH.blur()">
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
								  <select class="form-control" autocomplete="off" id="shock" name="shock" onBlur="indexForm.inputs.shock.blur()">
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
								  <select class="form-control" autocomplete="off" id="insulin" name="insulin" onBlur="indexForm.inputs.insulin.blur()">
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
								  <select class="form-control" autocomplete="off" id="preDM" name="preDM" onBlur="indexForm.inputs.preDM.blur()">
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
								  <select class="form-control" autocomplete="off" id="region" name="region" onchange="indexForm.inputs.region.blur()"> <!--the check function for region will populate the drop-down menu for centre-->
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
								  <select class="form-control" autocomplete="off" id="centre" name="centre" onBlur="indexForm.inputs.centre.blur()">
								 	 <option value="0">Select region first.</option> <!--the remaining options are added by the check function for region-->
								  </select>
								</div>
								<div id="div_centre_glyph"></div>
							</div>
						</div>
						<div id="div_centre_info" class="col-sm-5" style="color:red"></div>
					</div>
					<div class="row"> <!--episode type-->
						<div class="col-sm-7">
							<div id="div_episode" class="input-group has-feedback">
								<span class="input-group-addon"><a href="#" tabindex="-1" data-toggle="tooltip" title="Please select the episode type."><i class="glyphicon glyphicon-list-alt"></i></a></span>
								<span class="input-group-addon" style="width:210px;text-align:left"> Episode type</span>
								<div class="form-group">
								  <select class="form-control" autocomplete="off" id="episode" name="episode" onchange="indexForm.inputs.episode.blur()">
									<option value="1">Select episode type from list:</option>
									<option value="2">New episode</option>
									<option value="3">Protocol re-do</option>
									<option value="4">Testing/Training purposes</option>
								  </select>
								</div>
								<div id="div_episode_glyph"></div>
							</div>
						</div>
						<div id="div_episode_info" class="col-sm-5" style="color:red"></div>
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
			
			<!-- Joe Bloggs button-->
			<div class="row">
				<div class="col-sm-6 col-md-offset-3">
					<button type="button" onClick="indexForm.joeBloggs()" class="btn btn-primary btn-block">Joe Bloggs</button>
				</div>
			</div>

			<div class="row"> <!--Submit button-->
				<div class="col-sm-6 col-md-offset-3">
					<button type="button" onClick="indexForm.submit.click()" class="btn btn-primary btn-block">Submit</button>
				</div>
			</div>		
		</form>
		<br>
		<?php include 'php-1.2.1/footer.php';?> <!--includes footer file-->
	</div>
</body>
</html>