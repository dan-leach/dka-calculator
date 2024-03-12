function errHandler(e){
    console.log("errHandler:", e);

    let storageSupported = (typeof(Storage) !== "undefined") ? true : false //establish if cause for error is due to storage not being supported on client device
    console.log({storageSupported})

    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        console.log(this.responseText);
    }
    xhttp.open("GET", "error.php?error=" + e + "&stack=" + e.stack + "&storageSupported=" + storageSupported);
    xhttp.send();
    
    bootbox.dialog({
        message: '<div class="panel panel-danger"><div class="panel-heading" style="font-size:24px;">Oops, something went wrong...</div><div class="panel-body"><strong>DKA Calculator has run into a problem.</strong><br><br><div class="well">' + e + '<br>Stack: ' + e.stack + '</div>The error has been logged and will be reviewed. If you keep seeing this error please consider emailing us at <a href="mailto:admin@dka-calculator.co.uk">admin@dka-calculator.co.uk</a> including the details show here in your message.<br><br>Try reloading the website, or if the problem persists you can <a href="https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/" target="_blank"  rel="noopener"> download a blank protocol from the BSPED website.</a></div></div>',
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Close'
            },
        },
        backdrop: true,
    });
}