<style>
	.loader {
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		z-index: 9999;
		background: url('images/pageLoader.gif') 50% 50% no-repeat rgb(255,255,255);
		opacity: 1;
	}
</style>

<script type="text/javascript">
	$(window).on("load", function (e) {
		setTimeout(function(){
			$(".loader").fadeOut("slow");
		 }, 1000);
	});
</script>
