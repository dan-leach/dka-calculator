<!--this file contains the dependencies that are required for index.php-->

<!--favicon-->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

<!--bootstrap styling-->
<link rel="stylesheet" href="/externalDependencies/bootstrap-3.4.1-dist/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/externalDependencies/bootstrap-3.4.1-dist/js/bootstrap.min.js"></script>

<!--bootbox -->
<script src="/externalDependencies/bootbox/bootbox.min.js"></script>
<script src="/externalDependencies/bootbox/bootbox.locales.min.js"></script>

<!--my scripts-->
<script src="js-1.2.3/errHandler.js"></script>
<script src="js-1.2.3/settings.js"></script>
<script src="js-1.2.3/index.js"></script>

<!--moment-->
<script src="/externalDependencies/moment/moment.min.js"></script>

<!--date/time pickers-->
<link href="/externalDependencies/air-datepicker-2.2.3/css/datepicker.min.css" rel="stylesheet" type="text/css">
<script src="/externalDependencies/air-datepicker-2.2.3/js/datepicker.min.js"></script>
<script src="/externalDependencies/air-datepicker-2.2.3/js/i18n/datepicker.en.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js"></script>

<!--popovers and tooltips-->
<script>
	$(document).ready(function(){
        $('[data-toggle="popover"]').popover();
        $('[data-toggle="tooltip"]').tooltip(); 
	});
</script>

<!--unique ID from backend-->
<?php
	require 'link.php';
                    
    // Check connection
    if($link === false){
        die("Unable to generate audit ID. The server returned the following error message: " . mysqli_connect_error());
    }
	// Generate unique short ID
    $permitted_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    do {
        $pass = 0;
        $unique_id = substr(str_shuffle($permitted_chars), 0, 6);    
        if ($result = $link->query("SELECT * FROM calculator_table WHERE auditID = '$unique_id'")) {
            $row_cnt = $result->num_rows;
            if($row_cnt > 0){
                $unique_id = substr(str_shuffle($permitted_chars), 0, 6);
            } else {
                $pass ++;
            }
            /* close result set */
            $result->close();
        } else {
            echo "Unable to generate audit ID. The server returned the following error message: " . mysqli_error($link);
        }
    } while ($pass < 1);
    mysqli_close($link);
?>
<script>
    //this function must be in the php file not js as it requires the unique ID which is echo'd during php running on server side-->
	function add_auditID(){
		document.getElementById('auditID').value = "<?php echo $unique_id ?>";
	}
</script>