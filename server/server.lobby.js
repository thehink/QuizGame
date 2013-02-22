server.lobby  = function(q){
	this.title = "Test";
	this.id = 0;
	this.roomId = 'room_0';
	this.questions = 0;
	this.players = [];
	this.player_answers = [];
	this.quiz = q;
	
	if(q)
		this.loadQuiz(q);
};


server.lobby.prototype.reset = function(){
	this.question = 0;
	this.players = [];
	this.player_answers = [];
};

server.lobby.prototype.start = function(){
	
};

server.lobby.prototype.pause = function(){
};

server.lobby.prototype.stop = function(){
};

server.lobby.prototype.join = function(player){
	if(player && player.connected){
		player.socket.join(this.roomId);
		player.socket.emit("joinLobby", this.getInfo());
		player.socket.broadcast.to(this.roomId).emit('playerJoin', player.getInfo());
		this.players.push(player.id);
		return true;
	}else
		return false;
};

server.lobby.prototype.leave = function(player){
	for(var i = 0; i < this.players.length; ++i){
		if(this.players[i] == player.id){
			io.sockets.in(this.roomId).emit('playerLeave', player.getInfo());
			player.socket.leave(this.roomId);
			this.players.splice(i, 1);
			break;
		}
	}
};

server.lobby.prototype.getInfo = function(){
	return {
		id: this.id,
		title: this.title,
		players: this.getPlayersInfos(),
		quiz: this.getQuizInfo(),
	};
};

server.lobby.prototype.getQuizInfo = function(){
	return this.quiz ? {
		title: this.quiz.title,
		difficulty: this.quiz.difficulty,
		questions: this.quiz.questions.length,
	} : false;
};


server.lobby.prototype.loadQuiz = function(qs){
	this.quiz = qs;
};

server.lobby.prototype.update = function(){
	
};

server.lobby.prototype.recieve = function(id, answer){
	this.updateRound();
};

server.lobby.prototype.getPlayers = function(){
	var players = new Array(this.players.length);
	for(var i = 0; i < this.players.length; ++i){
		players[i] = server.quiz.getUser(this.players[i]);
	}
	return players;
};

server.lobby.prototype.getPlayersInfos = function(){
	var players = new Array(this.players.length);
	for(var i = 0; i < this.players.length; ++i){
		players[i] = server.quiz.getUser(this.players[i]).getInfo();
	}
	return players;
};

