client.network = {
	connected: false,
};

client.network.init = function(){
	client.network.connect();
};

client.network.connect = function(){
	var socket = client.network.socket = io.connect('http://'+window.location.hostname+'');
	socket.on('connect', client.network.listeners.connect);
	socket.on('disconnect', client.network.listeners.disconnect);
	socket.on('playerJoin', client.network.listeners.playerJoin);
	socket.on('playerStatus', client.network.listeners.playerStatus);
	socket.on('playerLeave', client.network.listeners.playerLeave);
	
	console.log("connected");
};

client.network.join = function(username){
	if(client.network.connected){
		client.network.socket.emit('join', username);
	}else{
		alert("Not connected to server!");
	}
};


client.network.listeners = {};

client.network.listeners.connect = function(data){
	client.network.connected = true;
	client.dispatch('connected');
};

client.network.listeners.disconnect = function(data){
	client.network.connected = false;
	client.dispatch('disconnected');
};

client.network.listeners.playerJoin = function(data){
	client.dispatch('playerJoin', data);
};

client.network.listeners.playerStatus = function(data){
	client.dispatch('playerStatus', data);
};

client.network.listeners.playerLeave = function(data){
	client.dispatch('playerLeave', data);
};
