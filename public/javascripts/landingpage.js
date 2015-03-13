$(document).ready(function(){
	$("#user-place").bind('input propertychange', function(){
		$("#user").val($("#user-place").val());
		console.log($("#user").val());
	});
	$("#password-place").bind('input propertychange', function(){
		$("#password").val($("#password-place").val());
		console.log($("#password").val());
	});


});