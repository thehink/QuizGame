/*********************************************
	Client.Quiz.js
	

**********************************************/

client.quiz = {
	users: [],
	currentQuiz: {},
	currentLobby: {},
	currentQuestion: {},
	timeLeft: 0,
};

client.quiz.init = function(){

};

client.quiz.join = function(player){
	client.ui.addUser(player);
	client.quiz.currentLobby.players.push(player);
};

client.quiz.leave = function(id){
	client.ui.removeUser(id);
};

client.quiz.syncPlayers = function(players){
	client.ui.syncPlayers(players);
};

client.quiz.chooseAnswer = function(index){
	client.ui.chooseAnswer(index);
	client.network.chooseAnswer(index);
};

client.quiz.setQuestion = function(data){
	client.quiz.currentQuestion = data;
	client.ui.setQuestion(data);
};

client.quiz.createLobby = function(){
	var title = $('#input-lobby-title').val();
	var desc = $('#input-lobby-desc').val();
	
	if(title.length < 1){
		alert("Du måste skriva in en titel!");
	}else{
		client.network.emit("createLobby", {
			id: client.currentQuizId,
			title: title,
			desc: desc,
		});
		client.ui.setModal("Skapar lobby", '<div class="loader"></div>', {});
	}
};

client.quiz.showLobby = function(id){
	if(client.quiz.currentLobby.id == id){
		client.ui.setLobbyPage(client.quiz.currentLobby);
	}else{
		client.network.emit("enterLobby", id);
	}
};

client.quiz.setLobby = function(lobby){
	client.quiz.currentLobby = lobby;
	client.quiz.setQuiz(lobby.quiz);
	client.ui.setLobby(lobby);
	client.quiz.showLobby(lobby.id);
	
	/*
	client.quiz.syncPlayers(lobby.players);
	client.quiz.setQuiz(lobby.quiz);
	client.ui.setLobby(lobby);
	
	client.ui.setStats(lobby.stats);
	*/
};

client.quiz.setQuiz = function(quiz){
	client.quiz.currentQuiz = quiz;
	client.ui.setQuiz(quiz);
};

client.quiz.quizEndOfRound = function(data){
	client.ui.quizEndOfRound(data);
};

client.quiz.status = function(username){

};

client.quiz.update = function(username, status){
	
};

client.quiz.setPageQuizes = function(category, data){
	client.ui.setQuizesPage(category, data);
	client.network.emit('getQuizes', {});
};

client.quiz.showLobbies = function(id){
	client.network.emit('getLobbies', {id:id});
};

client.quiz.correctAnswer = function(data){
	var correct = data.correct,
		players = data.players,
		stats = data.stats;
		
	for(var i in stats){
		if(client.quiz.currentLobby.players[i])
			client.quiz.currentLobby.players[i].points = stats[i];
	}
		
	client.ui.setStats(stats);
	client.ui.displayAnswers(players, correct);
};