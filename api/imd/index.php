<?php

$postcode = str_replace(' ', '', $data->patientPostcode);
$postcode = "'" . substr_replace(strtoupper($postcode), ' ', -3, 0) . "'";

$db = new PDO('sqlite:./imd/db/imd.sqlite3');

$imd_data_count = $db->query("SELECT COUNT() FROM onspd_aug19 WHERE onspd_aug19.pcds IN ( $postcode )");
$row_count = (int) $imd_data_count->fetchColumn();

$imd_data = $db->query(
    "SELECT
    onspd.pcds,
    imd.lsoa_name_11,
    imd.imd_rank,
    imd.imd_decile
  FROM
    imd19 AS imd
  INNER JOIN
    onspd_aug19 AS onspd ON imd.lsoa_code_11 = onspd.lsoa11
  WHERE
    onspd.pcds IN (	$postcode )"
);

function output($row)
{
    return intval($row['imd_decile']);
}

$imdDecile = null;

foreach ($imd_data as $row) $imdDecile = output($row);

?>