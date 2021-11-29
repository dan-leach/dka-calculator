<?php
    $stack = 'undefined';
    if (isset($_GET["stack"])) $stack = filter_var($_GET["stack"], FILTER_SANITIZE_STRING);
    error_log("client_side_error: " . $stack);

    $msg = "client_side_error: " . $stack;
    $msg = wordwrap($msg,70);
    mail("admin@dka-calculator.co.uk","Client side error report",$msg);

    echo "error.php: client_side_error logged";
    
?>