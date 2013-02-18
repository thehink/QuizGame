client = {
};

client.init = function(){
	client.network.init();
	client.listeners();
};

client.dispatch = function(){
	
};

client.bind = function(){
	
};

client.listeners = function(){
	$("#join-button").click(client.join);
	$("#username").focus(client.usernameFocus);
};

client.join = function(){
	var username = $("#username").val();
	if(username.length > 1){
		client.network.join();
	}else{
		alert("Du måste skriva in ett användarnamn i rutan");
		$("#username").focus().addClass("blinking");
	}
};

client.usernameFocus = function(){
	setTimeout(function(){
		$("#username").removeClass("blinking");
	},	5000);
};