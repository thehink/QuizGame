var modulesPath = "./nodejs/node_modules/";

var app = require('http'),
  io = require('socket.io'),
  fs = require('fs'),
  static = require('node-static');
	
var server = {
	 isRunning: true,
	 lastFrame: 0,
	 debug: true,
 };
 
 
 server.init = function(){
	 server.network.init();
	 server.quiz.init();
 };server.lobby  = function(q, data){
	data = data || {};
	this.title = data.title || "Quiz";
	this.id = 0;
	this.roomId = 'room_0';
	this.host = data.host || 0;
	this.questions = 0;
	this.currentQuestion = 0;
	this.players = [];
	this.player_answers = [];
	this.player_stats = {};
	this.timeleft = 0;
	this.running = false;
	this.paused = false;
	this.notifyTime = 10000;
	
	if(q)
		this.loadQuiz(q);
};

server.lobby.prototype.init = function(){
};

server.lobby.prototype.reset = function(){
	this.currentQuestion = 0;
	this.player_answers = [];
	this.player_stats = {};
	
	for(var i in this.players){
		var pl = server.quiz.getUser(this.players[i]);
		pl.points = 0;
		pl.correct = 0;
		pl.incorrect = 0;
		this.player_stats[pl.id] = 0;
	}
	
	io.sockets.in(this.roomId).emit('quizReset');
};

server.lobby.prototype.start = function(){
	if(!this.running){
		this.running = true;
		this.waitNextQuestion();
	}
};

server.lobby.prototype.pause = function(){
	this.paused = true;
};

server.lobby.prototype.resume = function(){
	this.paused = false;
};


server.lobby.prototype.stop = function(){
	clearTimeout(this.nqtimeout);
	clearTimeout(this.qtimeout);
	
	io.sockets.in(this.roomId).emit('stopQuiz');
	
	this.endRound();
	
};

server.lobby.prototype.setHost = function(player){
	this.host = player.id;
	io.sockets.in(this.roomId).emit('setLobbyHost', this.host);
};

server.lobby.prototype.waitNextQuestion = function(){
	this.pause();
	this.notifyStarted = Date.now();
	io.sockets.in(this.roomId).emit('notifyNextQuestion', this.notifyTime);
		
	var that = this;
	this.nqtimeout = setTimeout(function(){
			that.resume();
			that.nextQuestion();
	}, this.notifyTime);
}

server.lobby.prototype.nextQuestion = function(){
	var cq = this.getCurrentQuestion();
	
	io.sockets.in(this.roomId).emit('quizQuestion', {
		num: this.currentQuestion,
		question: cq.question,
		answers: cq.answers,
		points: cq.points,
		time: cq.time,
	});
	
	this.questionStarted = Date.now();

	var that = this;
	this.qtimeout = setTimeout(function(){
		that.endQuestion();
	}, cq.time*1000);
	//this.tick(cq.time);
};

server.lobby.prototype.endQuestion = function(){
	var cq = this.getCurrentQuestion();
	
	var pl_answers = {};
	
	for(var i in this.player_answers){
		var pl = server.quiz.getUser(this.players[i]),
			answer = this.player_answers[i];
			
			
		if(cq.correct.indexOf(answer) > -1){
			if(!this.player_stats[pl.id])
				this.player_stats[pl.id] = 0;
				
			this.player_stats[pl.id] += cq.points;
			pl.points += cq.points;
			pl.correct++;
		}else
			pl.incorrect++;
		
		pl_answers[pl.id] = answer;
	}
	
	io.sockets.in(this.roomId).emit('quizAnswer', {
		correct: cq.correct,
		players: pl_answers,
		stats: this.player_stats,
	});
	
	this.player_answers = [];
	
	if(++this.currentQuestion == this.questions){
		this.endRound();
	}else{
		this.waitNextQuestion();
	}
	
};

server.lobby.prototype.endRound = function(){
	this.running = false;
	
	var sortedStats = [];
	for(var i in this.player_stats){
		sortedStats.push([i, this.player_stats[i]]);
	}
	sortedStats.sort(function(a, b) {return b[1] - a[1]});
	
	var sortedPlayers = [];
	
	for(var i = 0; i < sortedStats.length; ++i){
		sortedPlayers.push(server.quiz.users[sortedStats[i][0]].getInfo());
	}
	
	io.sockets.in(this.roomId).emit('quizEndOfRound', sortedPlayers);
	this.reset();
};

server.lobby.prototype.onAnswer = function(answer){
	var that = this.player.currentLobby;
	var index = that.players.indexOf(this.player.id);
	that.player_answers[index] = answer;
};

server.lobby.prototype.getCurrentQuestion = function(){
	return this.quiz.questions[this.currentQuestion];
};

server.lobby.prototype.join = function(player){
	var player_joined = this.players.indexOf(player.id) > -1;
	if(player && player.connected && !player_joined){
		this.players.push(player.id);
		player.socket.join(this.roomId);
		player.socket.emit("joinLobby", this.getInfo());
		player.socket.broadcast.to(this.roomId).emit('playerJoin', player.getInfo());
		player.socket.on("answer", this.onAnswer);
		
		if(!this.player_stats[player.id])
			this.player_stats[player.id] = 0;
		
		if(this.running && !this.paused){
			var cq = this.getCurrentQuestion();
			player.socket.emit('quizQuestion', {
				num: this.currentQuestion,
				question: cq.question,
				answers: cq.answers,
				points: cq.points,
				time: cq.time,
				timeLeft: cq.time*1000 - Date.now() + this.questionStarted,
			});	
		}else if(this.running){
			var cq = this.getCurrentQuestion();
			player.socket.emit('notifyNextQuestion', this.notifyTime - Date.now() + this.notifyStarted);
		}
		
		return true;
	}else
		return false;
};

server.lobby.prototype.leave = function(player){
	for(var i = 0; i < this.players.length; ++i){
		if(this.players[i] == player.id){
			io.sockets.in(this.roomId).emit('playerLeave', player.id);
			player.socket.leave(this.roomId);
			this.players.splice(i, 1);
			break;
		}
	}
};

server.lobby.prototype.disconnected = function(player){
	
};

server.lobby.prototype.getInfo = function(){
	return {
		id: this.id,
		title: this.title,
		stats: this.player_stats,
		players: this.getPlayersInfos(),
		quiz: this.getQuizInfo(),
		running: this.running,
		question: this.currentQuestion,
		host: this.host,
	};
};

server.lobby.prototype.getQuizInfo = function(){
	return this.quiz ? {
		title: this.quiz.title,
		difficulty: this.quiz.difficulty,
		questions: this.quiz.questions.length,
		totalPoints: this.quiz.totalPoints,
	} : false;
};


server.lobby.prototype.loadQuiz = function(qs){
	this.quiz = qs;
	this.questions = qs.questions.length;
	this.quiz.totalPoints = 0;
	for(var i in qs.questions){
		this.quiz.totalPoints += qs.questions[i].points;
	}
};

server.lobby.prototype.tick = function(time){
	if(time)
		this.timeleft = time;
		
	if(this.timeleft-- == 0)
		return this.endQuestion();
		
	io.sockets.in(this.roomId).emit('quizQuestionTimeLeft', this.timeleft);
	
	var that = this;
	setTimeout(function(){
		that.tick();
	}, 1000);
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
		var clientFiles = new static.Server('./client/');
	  
		var httpServer = app.createServer(function (request, response) {
			request.addListener('end', function () {
				clientFiles.serve(request, response);
			});
		});
		
		httpServer.listen(port);
		io = io.listen(httpServer);
		
		if(!server.debug)
			io.set('log level', 1);
		
		io.sockets.on('connection', function (socket) {
		  
		  socket.on('join', server.network.listeners.join);
		  socket.on('disconnect', server.network.listeners.leave);
		  socket.on('leave', server.network.listeners.leave);
		  //socket.on('answer', server.network.listeners.answer);
		  socket.on('msg', server.network.listeners.msg);
		  
		  socket.on('getQuizes', server.network.listeners.getQuizes);
		  
		  socket.on('getLobbies', server.network.listeners.getLobbies);
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
		case "/start":
			if(this.player && this.player.currentLobby){
				if(this.player.id == this.player.currentLobby.host)
					this.player.currentLobby.start();
			}
		break;
		case "/stop":
			if(this.player && this.player.currentLobby){
				if(this.player.id == this.player.currentLobby.host)
					this.player.currentLobby.stop();
			}
		break;
		case "/pause":
			
		break;
		case "/msg":
			
		break;
		default:
		
	}
};

server.network.listeners.answer = function(data){
};

server.network.listeners.getQuizes = function(data){
	this.emit('listQuizes', server.quiz.getQuizesInfo(data));
};

server.network.listeners.getLobbies = function(data){
	this.emit('listLobbies', server.quiz.getLobbies(data));
};

server.network.listeners.createLobby = function(data){
	if(this.player)
		server.quiz.createLobby(this.player, data);
};

server.network.listeners.enterLobby = function(data){
	if(this.player)
		server.quiz.enterLobby(this.player, data);
};

server.network.listeners.ready = function(data){
};

server.network.listeners.msg = function(data){
};server.user = function(username){
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
};server.quiz = {
	users: [],
	usersByName: {},
	lobbies: [],
	quizes: [],
};

server.quiz.init = function(){
	var quiz = new server.aquiz(require('./kings_questions.json'));
	server.quiz.addQuiz(new server.aquiz(require('./silly_questions.json')));
	
	server.quiz.lobbies.push(new server.lobby(quiz));
	server.quiz.addQuiz(quiz);
};

server.quiz.setPlayerOnline = function(player, socket){
	player.socket = socket;
	player.connected = true;
	player.socket.player = player;
	server.network.ackPlayerOnline(player);
	//player.joinLobby(server.quiz.lobbies[0]);
};

server.quiz.setPlayerOffline = function(player){
	player.connected = false;
	server.network.ackPlayerOffline(player);
};

server.quiz.login = function(username, socket){
	if(socket.player)
		return 3;
	
	var prevUsername = username;
		username = username.replace(/[^a-z0-9_-~|.]/gi, '');
	
	
	if(prevUsername != username)
		console.log('Invalid username, ', prevUsername + ', changed to:' + username);
		
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
		if(typeof server.quiz.usersByName[id] == "number") //check type, if not 0 would return as false
			return server.quiz.users[server.quiz.usersByName[id]];
		else 
			return false;
	}else if(typeof id == "number"){
			return server.quiz.users[id];
	}
};


server.quiz.switchUserRoom = function(id){
	
};

server.quiz.createLobby = function(player, data){
	var quiz = server.quiz.quizes[data.id];
	if(quiz && data.title){
		var title = data.title.replace(/[^a-z0-9_-~|.]/gi, '');
		var desc = data.desc.replace(/[^a-z0-9_-~|.]/gi, '');
		var id = server.quiz.addLobby(quiz, {title: title, description: desc, host: player.id});
		player.socket.emit('lobbyCreated', id);
		//server.quiz.enterLobby(player, id);
	}
};

server.quiz.enterLobby = function(player, id){
	if(server.quiz.lobbies[id]){
		if(!player.currentLobby || player.currentLobby.id != id){
			player.leaveLobby();
		}
		player.joinLobby(server.quiz.lobbies[id]);
	}
};

server.quiz.getLobbies = function(data){
	var lobbies = [];
	for(var i in server.quiz.lobbies){
		var lobby = server.quiz.lobbies[i];
		if(lobby.quiz.id == data.id)
			lobbies.push(lobby.getInfo());
	}
	return lobbies;
};

server.quiz.getLobby = function(){
	
};

server.quiz.getQuizesInfo = function(){
	var infos = [];
	for(var i in server.quiz.quizes){
		var quiz = server.quiz.quizes[i];
		infos.push(quiz.getInfo());
	}
	return infos;
};

server.quiz.addQuiz = function(quiz){
	quiz.id = server.quiz.quizes.push(quiz)-1;
	return quiz.id;
};

server.quiz.getQuiz = function(id){
	return server.quiz.quizes[id];
};

server.quiz.getConnectedPlayers = function(){
	var players = [];
	for(var i in server.quiz.users){
		if(server.quiz.users[i].connected)
			players.push(server.quiz.users[i].getInfo());
	}
	return players;
};


server.quiz.addLobby = function(quiz, data){
	var lobby = new server.lobby(quiz, data);
	lobby.id = server.quiz.lobbies.push(lobby)-1;
	lobby.roomId = 'room_' + lobby.id;
	return lobby.id;
};

server.aquiz = function(quiz){
	this.id = 0;
	this.title = quiz.title || "";
	this.description = quiz.description || "";
	this.creator = quiz.creator || "";
	this.difficulty = quiz.difficulty || "";
	this.questions = quiz.questions || [];
};

server.aquiz.prototype = {
	getInfo: function(){
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			creator: this.creator,
			difficulty: this.difficulty,
			questions: this.getNumQuestions(),
		}
	},
	
	getNumQuestions: function(){
		return this.questions.length;
	},
};server.init();