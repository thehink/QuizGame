client = {
};

client.init = function(){
	client.network.init();
	client.listeners();
};

client.dispatch = function(){
	
};

client.bind = function(){
	
};

client.listeners = function(){
	$("#join-button").click(client.join);
	$("#username").focus(client.usernameFocus);
};

client.join = function(){
	var username = $("#username").val();
	if(username.length > 1){
		client.network.join();
	}else{
		alert("Du måste skriva in ett användarnamn i rutan");
		$("#username").focus().addClass("blinking");
	}
};

client.usernameFocus = function(){
	setTimeout(function(){
		$("#username").removeClass("blinking");
	},	5000);
};client.network = {
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
client.quiz = {
	users: [],
};

client.quiz.join = function(username, status){
	
};

client.quiz.update = function(username, status){
	
};client.ui = {};

client.ui.addUser = function(id, username){
	var html = '<tr id="player-'+id+'">';
		html += '<td>'+username+'</td>'
		html += '<td class="progress-cell"><div class="progress-bar" style="width:0%;">0%</div></td>';
        html += '<td></td>';
		html += '</tr>';
		
	$("#result-table > tbody > tr:last").before(html);
};

client.ui.removeUser = function(id){
	
};

client.ui.hideJoin = function(){
	$("#join-row").hide();
};

client.ui.showJoin = function(){
	$("#join-row").show();
};$(document).ready(function(e) {
	client.init();
});