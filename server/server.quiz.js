server.quiz = {
	linc: 0,
	users: [],
	usersByName: {},
	lobbies: {},
	quizes: [],
};

server.quiz.init = function(){
	var quiz = new server.aquiz(require('./kings_questions.json'));
	server.quiz.addQuiz(new server.aquiz(require('./silly_questions.json')));
	
	//server.quiz.lobbies.push(new server.lobby(quiz));
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
	lobby.id = server.quiz.linc++;
	server.quiz.lobbies[lobby.id] = lobby;
	//lobby.id = server.quiz.lobbies.push(lobby)-1;
	lobby.roomId = 'room_' + lobby.id;
	return lobby.id;
};

server.quiz.removeLobby = function(lobby){
	delete server.quiz.lobbies[lobby.id];
};

