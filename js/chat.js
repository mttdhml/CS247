$(document).ready(function(){
	$("#message-send").click(function(){
		//$("#message-send").text('Message Sent');
		var newhtml = '<div class=\"row\" > <p class=\"sender\">' + $("#message-box").val() + '</p> </div>';
		$("#message-box").val('');
		$("#chatbox").append(newhtml);

	});


});