client.network = {
	connected: false,
};

client.network.init = function(){
	client.network.connect();
};

client.network.connect = function(){
	var socket = client.network.socket = io.connect('http://'+client.server+'');
	
	//connection
	socket.on('connect', client.network.listeners.connect);
	socket.on('disconnect', client.network.listeners.disconnect);
	
	
	//login
	socket.on('joinResponse', client.network.listeners.joinResponse);
	socket.on('playerData', client.network.listeners.playerData);
	
	//lobby
	socket.on('joinLobby', client.network.listeners.joinLobby);
	socket.on('leaveLobby', client.network.listeners.leaveLobby);
	socket.on('lobbyClosed', client.network.listeners.lobbyClosed);
	socket.on('syncPlayers', client.network.listeners.syncPlayers);
	
	socket.on('listQuizes', client.network.listeners.listQuizes);
	socket.on('listLobbies', client.network.listeners.listLobbies);
	
	socket.on('lobbyCreated', client.network.listeners.lobbyCreated);
	socket.on('stopQuiz', client.network.listeners.stopQuiz);
	socket.on('changeHost', client.network.listeners.changeHost);
	
	//quiz
	socket.on('quizInfo', client.network.listeners.quizInfo);
	socket.on('quizQuestion', client.network.listeners.quizQuestion);
	socket.on('quizQuestionTimeLeft', client.ui.setTimeLeft);
	socket.on('quizAnswer', client.network.listeners.quizAnswer);
	socket.on('notifyNextQuestion', client.network.listeners.notifyNextQuestion);
	socket.on('quizEndOfRound', client.network.listeners.quizEndOfRound);
	socket.on('quizReset', client.network.listeners.quizReset);
	
	//player
	socket.on('playerJoin', client.network.listeners.playerJoin);
	socket.on('playerStatus', client.network.listeners.playerStatus);
	socket.on('playerLeave', client.network.listeners.playerLeave);

};

client.network.join = function(username){
	if(client.network.connected){
		client.network.emit('join', username);
	}else{
		alert("Not connected to server!");
	}
};

client.network.chooseAnswer = function(answer){
	client.network.emit("answer", answer);
};


client.network.sendCommand = function(cmd){
	client.network.emit('cmd', cmd);
};

client.network.emit = function(tag, data){
	if(client.network.connected){
		client.network.socket.emit(tag, data);
	}
};

client.network.listeners = {};

client.network.listeners.connect = function(data){
	client.network.connected = true;
	client.connected();
	//client.dispatch('connected');
};

client.network.listeners.disconnect = function(data){
	client.network.connected = false;
	
	client.ui.setModal('Förlorade kontakten med servern - Återansluter', '<div class="loader"></div>', {});
	
	//client.dispatch('disconnected');
};

/*=================================
			Login
==================================*/

client.network.listeners.joinResponse = function(data){
	if(data == 1){
		client.ui.hideJoin();
		if(History.getState().hash == "/"){
			if(typeof data.lobby == "number"){
				History.replaceState({state:1}, 'State 3', '/?lobby/' + data.lobby);
			}else{
				History.replaceState({state:1}, 'State 3', '/?quizes');
			}
		}else
			client.onStateChange();
			
	}else{
		switch(data){
			case 2: 
				alert("Användarnamnet används redan!");
				break;
			case 3: 
				alert("Du är redan inloggad med ett annat användarnamn!");
			break;
			default:
				alert("Fel på servern!");
		}
	}
};

client.network.listeners.playerData = function(data){
	client.setPlayer(data);
};

client.network.listeners.listQuizes = function(data){
	client.ui.listQuizes(data);
};

client.network.listeners.listLobbies = function(data){
	client.ui.listLobbies(data);
};


/*=================================
			Quiz
==================================*/

client.network.listeners.stopQuiz = function(){
	client.ui.stop();
};

client.network.listeners.quizInfo = function(data){
	client.ui.setQuiz(data);
};

client.network.listeners.quizQuestion = function(data){
	client.quiz.setQuestion(data);
};

client.network.listeners.quizAnswer = function(data){
	client.quiz.correctAnswer(data);
};

client.network.listeners.notifyNextQuestion = function(time){
	client.ui.notifyNextQuestion(time);
};

client.network.listeners.quizEndOfRound = function(data){
	client.quiz.quizEndOfRound(data);
};

client.network.listeners.quizReset = function(){
	client.ui.quizReset();
};

/*=================================
			Lobby
==================================*/

client.network.listeners.syncPlayers = function(data){
	client.quiz.syncPlayers(data);
};

client.network.listeners.joinLobby = function(lobby){
	client.quiz.setLobby(lobby);
};

client.network.listeners.leaveLobby = function(data){
};

client.network.listeners.lobbyClosed = function(data){
	alert("lobbyClosed");
};

client.network.listeners.lobbyCreated = function(id){
	History.pushState({state:1}, 'Lobby', '/?lobby/' + id);
};

client.network.listeners.changeHost = function(data){
	client.quiz.changeHost(data);
};

/*=================================
			Players
==================================*/

client.network.listeners.playerJoin = function(data){
	client.quiz.join(data);
};

client.network.listeners.playerStatus = function(data){
	client.quiz.status(data);
};

client.network.listeners.playerLeave = function(data){
	client.quiz.leave(data);
};
