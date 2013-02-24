client = {
	id: -1,
};

client.init = function(){
	client.network.init();
	client.quiz.init();
	client.enableListeners();
	
	client.ui.showLogin(client.join);
};

client.enableListeners = function(){
	$(document).keydown(function(event){
		if(event.which == 9){
			client.ui.showConsole();
			$("#console > input").focus();
			event.preventDefault();
		}
	});
	
	$("#console > input").keypress(function(event){
		if(event.which == 13){
			client.network.sendCommand($("#console > input").val());
			client.ui.hideConsole();
		}
	});
};

client.setPlayer = function(data){
	$("#username").text(data.username);
};

client.join = function(){
	var username = $("#username-input").val();
	if(username.length > 1){
		client.network.join(username);
	}else{
		alert("Du måste skriva in ett användarnamn i rutan");
		$("#username-input").focus().addClass("blinking");
	}
	
	return false;
};

client.usernameFocus = function(){
	setTimeout(function(){
		$("#username").removeClass("blinking");
	},	5000);
};