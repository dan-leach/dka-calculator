<?php

// Generate unique short ID
$permitted_chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
do {
    $pass = 0;
    $auditID = substr(str_shuffle($permitted_chars), 0, 6);    
    if ($result = $link->query("SELECT * FROM tbl_data_v2 WHERE auditID = '$auditID'")) {
        $row_cnt = $result->num_rows;
        if($row_cnt > 0){
            $auditID = substr(str_shuffle($permitted_chars), 0, 6);
        } else {
            $pass ++;
        }
        /* close result set */
        $result->close();
    } else {
        echo "Unable to generate audit ID. The server returned the following error message: " . mysqli_error($link);
    }
} while ($pass < 1);

?>