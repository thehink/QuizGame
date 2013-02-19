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
 };