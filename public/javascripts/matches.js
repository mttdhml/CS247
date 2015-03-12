$(document).ready(function(){
	$(".accept").click(function(){
		var invite_id = $(this).attr("id");
		$.ajax({ 
           context:this,
           url: '/accept',
           type: 'POST',
           cache: false, 
           data: { id: invite_id, accept: true}, 
           success: function(data){
           
			console.log(invite_id);
			//$("#" + id).hide();
			var selector =  "#" + id + ".invitation";
			console.log(selector);
			$(selector).remove();
            //$(element).parent().find('span:first').empty().html("<i class='fa fa-exclamation'></i>");
        	}
     	})
		
	});
	$(".decline").click(function(){
		var id = $(this).attr("id");
		$.ajax({ 
           context:this,
           url: '/accept',
           type: 'POST',
           cache: false, 
           data: { id: invite_id, accept: false}, 
           success: function(data){
           
			console.log(invite_id);
			//$("#" + id).hide();
			var selector =  "#" + id + ".invitation";
			console.log(selector);
			$(selector).remove();
            //$(element).parent().find('span:first').empty().html("<i class='fa fa-exclamation'></i>");
        	}
     	})
	});


});