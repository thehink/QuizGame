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
};