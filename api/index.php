<?php

require 'handleError.php';

if (!isset($_POST['data'])) send_error_response('No data received. ' , 400);
$data = json_decode($_POST['data']);
require 'dataValidation.php';

require 'private/keys.php';

if (isset($data->patientHash)) $patientHash = hash('sha256', $data->patientHash . $salt);

require 'imd/index.php';
unset($data->patientPostcode);

$clientIP = $_SERVER['REMOTE_ADDR'];

$calculations = new stdClass();
require 'calculations.php';

$link = mysqli_connect("localhost", $username, $password, "dkacalcu_dka_database");

require 'generateAuditID.php';

require 'databaseInsert.php';

$res = new stdClass();
$res->auditID = $auditID;
$res->calculations = $calculations;

echo json_encode($res);

?>
