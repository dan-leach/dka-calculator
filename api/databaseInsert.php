<?php

// Check connection
if($link === false) send_error_response("Audit data could not be logged. The server returned the following error message: " . mysqli_connect_error(), 500);

// Prepare insert 
$stmt = $link->prepare("INSERT INTO tbl_data_v2 (legalAgreement, patientAge, patientSex, protocolStartDatetime, pH, bicarbonate, glucose, ketones, weight, weightLimitOverride, shockPresent, insulinRate, preExistingDiabetes, episodeType, region, centre, ethnicGroup, ethnicSubgroup, preventableFactors, imdDecile, auditID, patientHash, clientDatetime, clientUseragent, clientIP, appVersion, calculations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if ( false===$stmt ) send_error_response("Audit data could not be logged. The server returned the following error message: prepare() failed: " . mysqli_error($link), 500);

// Bind parameters
$rc = $stmt->bind_param("sssssssssssssssssssssssssss", $data->legalAgreement, $data->patientAge, $data->patientSex, $data->protocolStartDatetime, $data->pH, $data->bicarbonate, $data->glucose, $data->ketones, $data->weight, $data->weightLimitOverride, $data->shockPresent, $data->insulinRate, $data->preExistingDiabetes, $data->episodeType, $data->region, $data->centre, $data->ethnicGroup, $data->ethnicSubgroup, $preventableFactorsJSON, $imdDecile, $auditID, $patientHash, $data->clientDatetime, $data->clientUseragent, $clientIP, $data->appVersion, $calculationsJSON);
if ( false===$rc ) send_error_response("Audit data could not be logged. The server returned the following error message: bind_param() failed: " . mysqli_error($link), 500);

// Execute the prepared insert statment
$rc = $stmt->execute();
if ( false===$rc ) send_error_response("Audit data could not be logged. The server returned the following error message: execute() failed: " . mysqli_error($link), 500);

$stmt->close();
mysqli_close($link);