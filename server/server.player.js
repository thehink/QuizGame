server.user = function(username){
	this.id = 0;
	this.username = username || "Undefined";
	this.points = 0;
	this.wins = 0;
	this.incorrect = 0;
	this.correct = 0;
	this.icRatio = 0;
	this.connected = false;
	this.currentLobby = null;
};

server.user.prototype.emit = function(key, data){
	if(this.socket)
		this.socket.emit(key, data);
};

server.user.prototype.getInfo = function(){
	return {
		id: this.id,
		username: this.username,
		points: this.points,
		wins: this.wins,
		incorrect: this.incorrect,
		correct: this.correct,
		icRatio: this.icRatio,
		lobby: this.currentLobby ? this.currentLobby.id : false,
	};
};

server.user.prototype.joinLobby = function(lobby){
	if(lobby)
		lobby.join(this);
	this.currentLobby = lobby;
};

server.user.prototype.leaveLobby = function(){
	if(this.currentLobby)
		this.currentLobby.leave(this);
	this.currentLobby = false;
};