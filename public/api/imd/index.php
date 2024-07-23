<?php

// Sanitize and format the postcode
$postcode = str_replace(' ', '', $data->patientPostcode);
$postcode = substr_replace(strtoupper($postcode), ' ', -3, 0);

try {
    // Create a new PDO instance
    $db = new PDO('sqlite:./imd/db/imd.sqlite3');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute the query to get the data
    $stmt = $db->prepare("
        SELECT
            onspd.pcds,
            imd.lsoa_name_11,
            imd.imd_rank,
            imd.imd_decile
        FROM
            imd19 AS imd
        INNER JOIN
            onspd_aug19 AS onspd ON imd.lsoa_code_11 = onspd.lsoa11
        WHERE
            onspd.pcds = :postcode
        LIMIT 1
    ");
    $stmt->bindParam(':postcode', $postcode, PDO::PARAM_STR);
    $stmt->execute();

    // Fetch the data
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $imdDecile = null;
    if ($row) {
        $imdDecile = intval($row['imd_decile']);
    }

    // Use $imdDecile as needed...

} catch (PDOException $e) {
    // Handle PDO exception
    echo 'Connection failed: ' . $e->getMessage();
}

?>