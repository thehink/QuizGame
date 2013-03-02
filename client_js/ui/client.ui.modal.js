client.ui.setModal = function(title, content, buttons){
	$(".modal-box > h1").html(title);
	$(".modal-box > .content").html(content);
	$(".modal-box > .footer > .right").empty();
	
	for(var i in buttons){
		var btn = $('<input id="join-button" type="button" value="'+i+'"/>');
		var btnClickEvent = buttons[i];
		btn.click(btnClickEvent, function(event){
			if(event.data())
				$("#modal-overlay").fadeOut();		//fade out if click function return true
		});
		$(".modal-box > .footer > .right").append(btn);
	}
	
	$("#modal-overlay").fadeIn();
};

client.ui.hideModal = function(){
	$("#modal-overlay").fadeOut();
};