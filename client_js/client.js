client = {
	id: -1,
	server: window.location.hostname,
	user: null,
};

client.init = function(){
	
	History.Adapter.bind(window,'statechange', client.onStateChange);

	client.ui.setModal("Laddar", '<div class="loader"></div>', {});

	$.getScript('http://'+client.server+'/socket.io/socket.io.js', function() {
			client.ui.setModal("Ansluter till servern", '<div class="loader"></div>', {});
            client.network.init();
			client.quiz.init();
			client.enableListeners();
     });
};

client.connected = function(){
	client.ui.showLogin(client.join);
};

client.onStateChange = function(){
	client.ui.hideJoin();
	var State = History.getState(); // Note: We are using History.getState() instead of event.state
     	//History.log(State.data, State.title, State.url);
		
		var hash = State.cleanUrl.replace('http://'+window.location.hostname,'').replace('/?','');
		var bits = hash.split('/');
		
		switch(bits[0]){
			case 'quizes': 
				client.quiz.setPageQuizes(bits[1], bits[2]);
			break;
			case 'lobbies': 
				client.currentQuizId = bits[1];
				client.quiz.showLobbies(bits[1]);
			break;
			case 'lobby': 
				client.quiz.showLobby(bits[1]);
			break;
		}
		
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
			$("#console > input").val('')
			client.ui.hideConsole();
		}
	});
	
	$('#quizes-link').click(function(){
		History.pushState({}, 'Titel', '/?quizes');
		return false;
	});
};

client.setPlayer = function(data){
	client.user = data;
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