<?php

function handle_error($error)
{
    //sendMail(addHeader().$error."<br><br>".addFooter(false), 'DKA Calculator error notification', 'admin@dka-calculator.co.uk', 'DKA Calculator');
    http_response_code(500);
    die(json_encode('Sorry, an unexpected error has occurred. This event has been logged. If you keep seeing this message please contact admin@dka-calculator.co.uk including the error message below and a description of what you were doing when it appeared. ' . preg_replace('/[[:cntrl:]]/', '', $error)));
}
set_exception_handler('handle_error');

function send_error_response($msg, $status)
{
    http_response_code($status);
    die(json_encode($msg));
}

?>