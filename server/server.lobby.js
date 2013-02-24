server.lobby  = function(q){
	this.title = "Quiz";
	this.id = 0;
	this.roomId = 'room_0';
	this.questions = 0;
	this.currentQuestion = 0;
	this.players = [];
	this.player_answers = [];
	this.player_stats = {};
	this.timeleft = 0;
	this.running = false;
	this.paused = false;
	
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
};

server.lobby.prototype.waitNextQuestion = function(){
	this.pause();
	var notifyTime = 6000;
	io.sockets.in(this.roomId).emit('notifyNextQuestion', notifyTime);
		
	var that = this;
	setTimeout(function(){
			that.resume();
			that.nextQuestion();
	}, notifyTime);
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

	var that = this;
	this.tick(cq.time);
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
	if(player && player.connected){
		this.players.push(player.id);
		player.socket.join(this.roomId);
		player.socket.emit("joinLobby", this.getInfo());
		player.socket.broadcast.to(this.roomId).emit('playerJoin', player.getInfo());
		player.socket.on("answer", this.onAnswer);
		
		if(!this.player_stats[player.id])
			this.player_stats[player.id] = 0;
		
		if(this.running){
			var cq = this.getCurrentQuestion();
			player.socket.emit('quizQuestion', {
				num: this.currentQuestion,
				question: cq.question,
				answers: cq.answers,
				time: cq.time,
			});	
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

server.lobby.prototype.getInfo = function(){
	return {
		id: this.id,
		title: this.title,
		stats: this.player_stats,
		players: this.getPlayersInfos(),
		quiz: this.getQuizInfo(),
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

