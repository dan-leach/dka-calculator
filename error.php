<?php
    $stack = 'undefined';
    if (isset($_GET["stack"])) $stack = htmlspecialchars($_GET["stack"]);
    if (isset($_GET["storageSupported"])) $storageSupported = htmlspecialchars($_GET["storageSupported"]);
    error_log("client_side_error: " . $stack . "; storageSupported = " . $storageSupported);

    $msg = "client_side_error: " . $stack;
    $msg .= " - storageSupported: " . $storageSupported;
    $msg .= " - client IP: " . $_SERVER['REMOTE_ADDR'];
    $msg .= " - user agent: " .$_SERVER['HTTP_USER_AGENT'];
    $msg = wordwrap($msg,70);
    mail("admin@dka-calculator.co.uk","Client side error report",$msg);

    echo "error.php: client_side_error logged";
    
?>