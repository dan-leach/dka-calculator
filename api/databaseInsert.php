<?php

// Check connection
if($link === false) die("Audit data could not be logged. The server returned the following error message: " . mysqli_connect_error());

// Prepare insert 
$stmt = $link->prepare("INSERT INTO tbl_data_v2 (legalAgreement, patientAge, patientSex, protocolStartDatetime, pH, bicarbonate, weight, weightLimitOverride, shockPresent, insulinRate, preExistingDiabetes, episodeType, region, centre, ethnicGroup, preventableFactors, auditID, patientHash, clientDatetime, clientUseragent, clientIP, appVersion, calculations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if ( false===$stmt ) die("Audit data could not be logged. The server returned the following error message: prepare() failed: " . mysqli_error($link));

// Bind parameters
$rc = $stmt->bind_param("sssssssssssssssssssssss", $data->legalAgreement, $data->patientAge, $data->patientSex, $data->protocolStartDatetime, $data->pH, $data->bicarbonate, $data->weight, $data->weightLimitOverride, $data->shockPresent, $data->insulinRate, $data->preExistingDiabetes, $data->episodeType, $data->region, $data->centre, $data->ethnicGroup, json_encode($data->preventableFactors), $auditID, $patientHash, $data->clientDatetime, $data->clientUseragent, $clientIP, $data->appVersion, json_encode($calculations));
if ( false===$rc ) die("Audit data could not be logged. The server returned the following error message: bind_param() failed: " . mysqli_error($link));

// Execute the prepared insert statment
$rc = $stmt->execute();
if ( false===$rc ) die("Audit data could not be logged. The server returned the following error message: execute() failed: " . mysqli_error($link));

$stmt->close();
mysqli_close($link);