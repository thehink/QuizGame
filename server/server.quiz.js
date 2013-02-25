server.quiz = {
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
	if(socket.player)
		return 3;
	
	var prevUsername = username;
		username = username.replace(/[^a-z0-9_.]/gi, '');
	
	
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

