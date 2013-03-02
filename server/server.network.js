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
};