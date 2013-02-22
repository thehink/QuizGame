server.user = function(username){
	this.id = 0;
	this.username = username || "Undefined";
	this.points = 0;
	this.wins = 0;
	this.wrong = 0;
	this.correct = 0;
	this.connected = false;
	this.currentLobby = {};
};

server.user.prototype.getInfo = function(){
	return {
		id: this.id,
		username: this.username,
		points: this.points,
		wins: this.wins,
		wrong: this.wrong,
		correct: this.correct,
	};
};

server.user.prototype.joinLobby = function(lobby){
	lobby.join(this);
	this.currentLobby = lobby;
};

server.user.prototype.leaveLobby = function(){
	this.currentLobby.leave(this);
	this.currentLobby = false;
};