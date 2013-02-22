client.quiz = {
	users: [],
};

client.quiz.init = function(){

};

client.quiz.join = function(player){
	client.ui.addUser(player.id, player.username);
};

client.quiz.leave = function(id){
	client.ui.removeUser(id);
};

client.quiz.syncPlayers = function(players){
	client.ui.syncPlayers(players);
};

client.quiz.status = function(username){

};

client.quiz.update = function(username, status){
	
};

client.quiz.correctAnswer = function(){
	
};