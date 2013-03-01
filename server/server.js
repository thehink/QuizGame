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
 };