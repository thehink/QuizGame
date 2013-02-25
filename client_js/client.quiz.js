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

client.quiz.setLobby = function(lobby){
	client.quiz.currentLobby = lobby;
	client.quiz.syncPlayers(lobby.players);
	client.quiz.setQuiz(lobby.quiz);
	client.ui.setLobby(lobby);
	
	client.ui.setStats(lobby.stats);
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

client.quiz.correctAnswer = function(data){
	var correct = data.correct,
		players = data.players,
		stats = data.stats;
		
	client.ui.setStats(stats);
	client.ui.displayAnswers(players, correct);
};