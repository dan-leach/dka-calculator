<?php
//data validation and sanitisation

//legalAgreement
if (!isset($data->legalAgreement)) send_error_response("Agreement to legal disclaimer is required.", 401);
if ($data->legalAgreement == 1) {
    $data->legalAgreement = 'true';
} else {
    send_error_response("Agreement to legal disclaimer is required.", 401);
}

//patientDOB
if (!isset($data->patientDOB)) send_error_response("Patient date of birth is required.", 400);
$data->patientDOB = htmlspecialchars($data->patientDOB);

//patientAge 
if (!isset($data->patientAge)) send_error_response("Patient age is required.", 400);
$data->patientAge = filter_var($data->patientAge, FILTER_VALIDATE_INT);

//patientSex
if (!isset($data->patientSex)) send_error_response("Patient sex is required.", 400);
$data->patientSex = htmlspecialchars($data->patientSex);

//patientNHS
if (isset($data->patientNHS)) $data->patientNHS = filter_var($data->patientNHS, FILTER_VALIDATE_INT);

//patientPostcode
if (isset($data->patientPostcode)) $data->patientPostcode = htmlspecialchars($data->patientPostcode);

//protocolStartDatetime 
if (!isset($data->protocolStartDatetime )) send_error_response("Protocol start datetime is required.", 400);
$data->protocolStartDatetime  = htmlspecialchars($data->protocolStartDatetime );

//pH 
if (!isset($data->pH)) send_error_response("pH is required.", 400);
$data->pH = filter_var($data->pH, FILTER_VALIDATE_FLOAT);

//bicarbonate 
if (!isset($data->bicarbonate)) $data->bicarbonate = filter_var($data->bicarbonate, FILTER_VALIDATE_FLOAT);

//glucose
if (!isset($data->glucose)) $data->glucose = filter_var($data->glucose, FILTER_VALIDATE_FLOAT);

//ketones
if (!isset($data->ketones)) $data->ketones = filter_var($data->ketones, FILTER_VALIDATE_FLOAT);

//weight 
if (!isset($data->weight)) send_error_response("Weight is required.", 400);
$data->weight = filter_var($data->weight, FILTER_VALIDATE_FLOAT);

//shockPresent 
if (!isset($data->shockPresent)) send_error_response("Clinical shock status is required.", 400);
$data->shockPresent = htmlspecialchars($data->shockPresent);

//insulinRate 
if (!isset($data->insulinRate)) send_error_response("Insulin rate is required.", 400);
$data->insulinRate = filter_var($data->insulinRate, FILTER_VALIDATE_FLOAT);

//preExistingDiabetes 
if (!isset($data->preExistingDiabetes)) send_error_response("Pre-existing diabetes status is required.", 400);
$data->preExistingDiabetes = htmlspecialchars($data->preExistingDiabetes);

//episodeType 
if (!isset($data->episodeType)) send_error_response("Episode type is required.", 400);
$data->episodeType = htmlspecialchars($data->episodeType);

//region 
if (!isset($data->region)) send_error_response("Region is required.", 400);
$data->region = htmlspecialchars($data->region);

//centre 
if (!isset($data->centre)) send_error_response("Centre is required.", 400);
$data->centre = htmlspecialchars($data->centre);

//ethnicGroup 
if (!isset($data->ethnicGroup)) send_error_response("Ethnic group is required.", 400);
$data->ethnicGroup = htmlspecialchars($data->ethnicGroup);

//preventableFactors
if (!isset($data->preventableFactors)) send_error_response("Preventable factors selection is required.", 400);
if (!sizeof($data->preventableFactors)) send_error_response("Preventable factors selection is required.", 400);
foreach ($data->preventableFactors as $key => $factor) $preventableFactors[$key] = htmlspecialchars($factor);

//weightLimitOverride 
if (!isset($data->weightLimitOverride)) send_error_response("Weight limit override status is required.", 400);
if ($data->weightLimitOverride == 1) {
    $data->weightLimitOverride = 'true';
} else {
    $data->weightLimitOverride = 'false';
}

//appVersion 
if (!isset($data->appVersion)) send_error_response("App version is required.", 400);
$data->appVersion = htmlspecialchars($data->appVersion);

//clientDatetime 
if (!isset($data->clientDatetime )) send_error_response("Client datetime is required.", 400);
$data->clientDatetime  = htmlspecialchars($data->clientDatetime );

//clientUseragent 
if (!isset($data->clientUseragent )) send_error_response("Client useragent is required.", 400);
$data->clientUseragent  = htmlspecialchars($data->clientUseragent );

?>