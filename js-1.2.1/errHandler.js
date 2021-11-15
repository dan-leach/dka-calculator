function errHandler(e){
    console.log("errHandler");
    console.log(e);

    bootbox.dialog({
        title: "<span style='font-size: 24px'>Oops, something went wrong...</span>",
        message: "DKA Calculator has run into a problem.<br><br>Error type: " + e.name + "<br>Description: " + e.description + "<br>Stack: " + e.stack,
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Close'
            },
        },
        backdrop: true,
    });
}