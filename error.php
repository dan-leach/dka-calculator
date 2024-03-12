<?php
    $error = 'undefined';
    $stack = 'undefined';
    $storageSupported = 'undefined';
    if (isset($_GET["error"])) $error = htmlspecialchars($_GET["error"]);
    if (isset($_GET["stack"])) $stack = htmlspecialchars($_GET["stack"]);
    if (isset($_GET["storageSupported"])) $storageSupported = htmlspecialchars($_GET["storageSupported"]);
    

    $msg = "client_side_error: " . $error;
    $msg .= " - stack: " . $stack;
    $msg .= " - storageSupported: " . $storageSupported;
    $msg .= " - client IP: " . $_SERVER['REMOTE_ADDR'];
    $msg .= " - user agent: " . htmlspecialchars($_SERVER['HTTP_USER_AGENT']);
    error_log($msg);
    $msg = wordwrap($msg,70);
    mail("admin@dka-calculator.co.uk","Client side error report",$msg);

    echo "error.php: client_side_error logged";
    
?>