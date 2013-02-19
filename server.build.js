var modulesPath = "./nodejs/node_modules/";

var app = require('http'),
  io = require(modulesPath+'socket.io'),
  fs = require('fs'),
  static = require(modulesPath+'node-static');

	
var server = {
	 isRunning: true,
	 lastFrame: 0,
 };
 
 server.dispatch = function(){
	
};

server.bind = function(){
	
};
 
 server.init = function(){
	 server.network.init();
 };server.network = {};

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
		  socket.on('ready', server.network.listeners.ready);
		});
		
};

server.network.listeners = {};

server.network.listeners.join = function(data){
};
server.network.listeners.leave = function(data){
};
server.network.listeners.answer = function(data){
};
server.network.listeners.ready = function(data){
};
server.network.listeners.msg = function(data){
};server.quiz = {
	users: [],
};

server.quiz.addUser = function(){
	
};server.init();