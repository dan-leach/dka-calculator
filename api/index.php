<?php

require 'handleError.php';

$data = json_decode($_POST['data']);
require 'dataValidation.php';

require 'private/keys.php';

$patientHash = hash('sha256', $data->patientNHS . $data->patientDOB . $salt);
unset($data->patientNHS);
unset($data->patientDOB);

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
