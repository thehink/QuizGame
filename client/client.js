client = {
	id: -1,
};

client.init = function(){
	client.network.init();
	client.quiz.init();
	client.enableListeners();
};

Events.enable.call(client);


client.enableListeners = function(){

	$("#join-button").click(client.join);
	$("#username-input").focus(client.usernameFocus);

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
	console.log("SetPlayer:", data);
};

client.join = function(){
	var username = $("#username-input").val();
	if(username.length > 1){
		client.network.join(username);
	}else{
		alert("Du måste skriva in ett användarnamn i rutan");
		$("#username-input").focus().addClass("blinking");
	}
};

client.usernameFocus = function(){
	setTimeout(function(){
		$("#username").removeClass("blinking");
	},	5000);
};