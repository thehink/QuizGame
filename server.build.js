var modulesPath = "./nodejs/node_modules/";

var app = require('http'),
  io = require(modulesPath+'socket.io'),
  fs = require('fs'),
  static = require(modulesPath+'node-static');

	
var server = {
	 isRunning: true,
	 lastFrame: 0,
 };
 
 
 server.init = function(){
	 server.network.init();
	 server.quiz.init();
 };server.lobby  = function(q){
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

server.network = {};

server.network.init = function(){
		var port = 80;
		var clientFiles = new static.Server(__dirname+'\\client');
	  
		var httpServer = app.createServer(function (request, response) {
			request.addListener('end', function () {
				clientFiles.serve(request, response);
			});
		});
		
		httpServer.listen(port);
		io = io.listen(httpServer);
		
		io.sockets.on('connection', function (socket) {
		  
		  socket.on('join', server.network.listeners.join);
		  socket.on('disconnect', server.network.listeners.leave);
		  socket.on('leave', server.network.listeners.leave);
		  socket.on('answer', server.network.listeners.answer);
		  socket.on('msg', server.network.listeners.msg);
		  socket.on('getLobbies', server.network.listeners.ready);
		  socket.on('createLobby', server.network.listeners.createLobby);
		  socket.on('enterLobby', server.network.listeners.enterLobby);
		  socket.on('setLobbySettings', server.network.listeners.ready);
		  socket.on('cmd', server.network.listeners.cmd);
		});
		
};

server.network.ackPlayerOnline = function(player){
	player.socket.emit("playerData", player.getInfo());

};

server.network.ackPlayerOffline = function(player){
	player.leaveLobby();
};

server.network.ackPlayerStatus = function(player, correct){
	player.socket.broadcast.emit("playerStatus", [player, correct]);
};

server.network.ackPlayerWin = function(player){
	player.socket.broadcast.emit("playerWin", player);
};

server.network.listeners = {};

server.network.listeners.join = function(data){
	var response = server.quiz.login(data, this);
	this.emit('joinResponse', response);

};

server.network.listeners.leave = function(data){
	if(this.player)
		server.quiz.setPlayerOffline(this.player);
};

server.network.listeners.cmd = function(cmd){
	switch(cmd){
		case "start":
			server.quiz.lobbies[0].start();
		break;
		case "stop":
			server.quiz.lobbies[0].stop();
		break;
		case "pause":
			server.quiz.lobbies[0].pause();
		break;
	}
};

server.network.listeners.answer = function(data){
};

server.network.listeners.createLobby = function(data){
};

server.network.listeners.enterLobby = function(data){
};

server.network.listeners.ready = function(data){
};

server.network.listeners.msg = function(data){
};server.user = function(username){
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
};server.quiz = {
	users: [],
	usersByName: {},
	lobbies: [],
};

server.quiz.init = function(){
	var quiz = require('./kings_questions.json');
	server.quiz.lobbies.push(new server.lobby(quiz));
};

server.quiz.setPlayerOnline = function(player, socket){
	player.socket = socket;
	player.connected = true;
	player.socket.player = player;
	server.network.ackPlayerOnline(player);
	
	player.joinLobby(server.quiz.lobbies[0]);
};

server.quiz.setPlayerOffline = function(player){
	player.connected = false;
	server.network.ackPlayerOffline(player);
};

server.quiz.login = function(username, socket){
	var player = server.quiz.getUser(username);
	if(!player){
		player = server.quiz.addUser(username, socket);
		server.quiz.setPlayerOnline(player, socket);
		return 1;
	}else if(!player.connected){
		server.quiz.setPlayerOnline(player, socket);
		return 1;
	}else{
		return 2;
	}
};


server.quiz.addUser = function(username, socket){
	if(!server.quiz.usersByName[username]){
		var player = new server.user(username);
		player.socket = socket;
		player.id = server.quiz.users.push(player)-1;
		server.quiz.usersByName[username] = player.id;
		return player;
	}else{
		console.log("Couldn't add player because the player already exists!");
		return false;
	}
	
};

server.quiz.getUser = function(id){
	if(typeof id == 'string'){
		if(server.quiz.usersByName[id])
			return server.quiz.users[server.quiz.usersByName[id]];
		else 
			return false;
	}else if(typeof id == "number"){
			return server.quiz.users[id];
	}
};

server.quiz.switchUserRoom = function(id){
	
};

server.quiz.getConnectedPlayers = function(){
	var players = [];
	for(var i in server.quiz.users){
		if(server.quiz.users[i].connected)
			players.push(server.quiz.users[i].getInfo());
	}
	return players;
};


server.quiz.addLobby = function(title, quiz){
	var lobby = new server.quiz.lobby(quiz);
	lobby.id = server.quiz.lobbies.push(lobby)-1;
	lobby.roomId = 'room_' + lobby.id;
};

server.init();