/**
 * By using the native call and apply methodology, this class allows
 * the user to have full control over custom event creation and handling.
 *
 * @author Garth Henson garth@guahanweb.com
 * @version 1.0
 */

/** @namespace */
var Events = {};
(function() {
    Events = /** @lends Events */{
        /**
         * Enables event consumption and management on the provided class. This
         * needs to be called from the context of the object in which events are
         * to be enabled.
         * 
         * @public
         * @example
         * var MyObj = function() {
         *     var self = this;
         *     this.init = function() {
         *         Events.enable.call(self);
         *     };
         *     
         *     this.log = function() {
         *         console.log(self);
         *         self.fireEvent('log');
         *     };
         *
         *     this.init();
         * };
         *
         * var o = new MyObj();
         * o.addListener('log', function() { console.log('Event fired!'); });
         * o.log();
         */
        enable : function() {
            var self = this;
            self.listeners = {};
            
            // Fire event
            self.dispatch = function(ev, args) {
                Events.dispatch.call(self, ev, args);
            };
            
            // Add listener
            self.addListener = function(ev, fn) {
                Events.addListener.call(self, ev, fn);
            };
            
            // Remove listener
            self.removeListener = function(ev, fn) {
                Events.removeListener.call(self, ev, fn);
            }
        },
        
        /**
         * Fires the provided <code>ev</code> event and executes all listeners attached
         * to it. If <code>args</code> is provided, they will be passed along to the
         * listeners.
         *
         * @public
         * @param {string} ev The name of the event to fire
         * @param {array} args Optional array of args to pass to the listeners
         */
        dispatch : function(ev, args) {
            if (!!this.listeners[ev]) {
                for (var i = 0; i < this.listeners[ev].length; i++) {
                    var fn = this.listeners[ev][i];
                    fn.apply(window, args);
                }
            }
        },
        
        /**
         * Binds the execution of the provided <code>fn</code> when the <code>ev</code> is fired.
         *
         * @public
         * @param {string} ev The name of the event to bind
         * @param {function} fn A function to bind to the event
         */
        addListener : function(ev, fn) {
            // Verify we have events enabled
            Events.enable.call(this, ev);
            
            if (!this.listeners[ev]) {
                this.listeners[ev] = [];
            }
            
            if (fn instanceof Function) {
                this.listeners[ev].push(fn);
            }
        },
        
        /**
         * Removes the provided <code>fn</code> from the <code>ev</code>. If no function is
         * provided, all listeners for this event are removed.
         *
         * @public
         * @param {string} ev The name of the event to unbind
         * @param {function} fn An optional listener to be removed
         */
        removeListener : function(ev, fn) {
            if (!!this.listeners[ev] && this.listeners[ev].length > 0) {
                // If a function is provided, remove it
                if (!!fn) {
                    var new_fn = [];
                    for (var i = 0; i < this.listeners[ev].length; i++) {
                        if (this.listeners[ev][i] != fn) {
                            new_fn.push(this.listeners[ev][i]);
                        }
                    }
                    this.listeners[ev] = new_fn;
                } else { // Otherwise, remove them all
                    this.listeners[ev] = [];
                }
            }
        }
    };
}());// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();client = {
	id: -1,
};

client.init = function(){
	client.network.init();
	client.quiz.init();
	client.enableListeners();
	
	client.ui.showLogin(client.join);
};

client.enableListeners = function(){
	$(document).keydown(function(event){
		if(event.which == 9){
			client.ui.showConsole();
			$("#console > input").focus();
			event.preventDefault();
		}
	});
	
	$("#console > input").keypress(function(event){
		if(event.which == 13){
			client.network.sendCommand($("#console > input").val());
			client.ui.hideConsole();
		}
	});
};

client.setPlayer = function(data){
	$("#username").text(data.username);
};

client.join = function(){
	var username = $("#username-input").val();
	if(username.length > 1){
		client.network.join(username);
	}else{
		alert("Du måste skriva in ett användarnamn i rutan");
		$("#username-input").focus().addClass("blinking");
	}
	
	return false;
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
	
	//connection
	socket.on('connect', client.network.listeners.connect);
	socket.on('disconnect', client.network.listeners.disconnect);
	
	
	//login
	socket.on('joinResponse', client.network.listeners.joinResponse);
	socket.on('playerData', client.network.listeners.playerData);
	
	//lobby
	socket.on('joinLobby', client.network.listeners.joinLobby);
	socket.on('leaveLobby', client.network.listeners.leaveLobby);
	socket.on('lobbyClosed', client.network.listeners.lobbyClosed);
	socket.on('syncPlayers', client.network.listeners.syncPlayers);
	
	//quiz
	socket.on('quizInfo', client.network.listeners.quizInfo);
	socket.on('quizQuestion', client.network.listeners.quizQuestion);
	socket.on('quizQuestionTimeLeft', client.ui.setTimeLeft);
	socket.on('quizAnswer', client.network.listeners.quizAnswer);
	socket.on('notifyNextQuestion', client.network.listeners.notifyNextQuestion);
	socket.on('quizEndOfRound', client.network.listeners.quizEndOfRound);
	socket.on('quizReset', client.network.listeners.quizReset);
	
	//player
	socket.on('playerJoin', client.network.listeners.playerJoin);
	socket.on('playerStatus', client.network.listeners.playerStatus);
	socket.on('playerLeave', client.network.listeners.playerLeave);
	
	console.log("connected");
};

client.network.join = function(username){
	if(client.network.connected){
		client.network.emit('join', username);
	}else{
		alert("Not connected to server!");
	}
};

client.network.chooseAnswer = function(answer){
	client.network.emit("answer", answer);
};


client.network.sendCommand = function(cmd){
	client.network.emit('cmd', cmd);
};

client.network.emit = function(tag, data){
	if(client.network.connected){
		client.network.socket.emit(tag, data);
	}
};

client.network.listeners = {};

client.network.listeners.connect = function(data){
	client.network.connected = true;
	//client.dispatch('connected');
};

client.network.listeners.disconnect = function(data){
	client.network.connected = false;
	//client.dispatch('disconnected');
};

/*=================================
			Login
==================================*/

client.network.listeners.joinResponse = function(data){
	if(data == 1){
		client.ui.hideJoin();
	}else{
		switch(data){
			case 2: 
				alert("Anv�ndarnamnet anv�nds redan!");
				break;
			case 3: 
				alert("Du �r redan inloggad med ett annat anv�ndarnamn!");
			break;
			default:
				alert("Fel p� servern!");
		}
	}
};

client.network.listeners.playerData = function(data){
	client.setPlayer(data);
};

/*=================================
			Quiz
==================================*/

client.network.listeners.quizInfo = function(data){
	client.ui.setQuiz(data);
};

client.network.listeners.quizQuestion = function(data){
	client.quiz.setQuestion(data);
};

client.network.listeners.quizAnswer = function(data){
	client.quiz.correctAnswer(data);
};

client.network.listeners.notifyNextQuestion = function(time){
	client.ui.notifyNextQuestion(time);
};

client.network.listeners.quizEndOfRound = function(data){
	client.quiz.quizEndOfRound(data);
};

client.network.listeners.quizReset = function(){
	client.ui.quizReset();
};

/*=================================
			Lobby
==================================*/

client.network.listeners.syncPlayers = function(data){
	client.quiz.syncPlayers(data);
};

client.network.listeners.joinLobby = function(lobby){
	client.quiz.setLobby(lobby);
};

client.network.listeners.leaveLobby = function(data){
};

client.network.listeners.lobbyClosed = function(data){
	alert("lobbyClosed");
};

/*=================================
			Players
==================================*/

client.network.listeners.playerJoin = function(data){
	client.quiz.join(data);
};

client.network.listeners.playerStatus = function(data){
	client.quiz.status(data);
};

client.network.listeners.playerLeave = function(data){
	client.quiz.leave(data);
};
client.quiz = {
	users: [],
	currentQuiz: {},
	currentLobby: {},
	currentQuestion: {},
	timeLeft: 0,
};

client.quiz.init = function(){

};

client.quiz.join = function(player){
	client.ui.addUser(player);
};

client.quiz.leave = function(id){
	client.ui.removeUser(id);
};

client.quiz.syncPlayers = function(players){
	client.ui.syncPlayers(players);
};

client.quiz.chooseAnswer = function(index){
	client.ui.chooseAnswer(index);
	client.network.chooseAnswer(index);
};

client.quiz.setQuestion = function(data){
	client.quiz.currentQuestion = data;
	client.ui.setQuestion(data);
};

client.quiz.setLobby = function(lobby){
	client.quiz.currentLobby = lobby;
	client.quiz.syncPlayers(lobby.players);
	client.quiz.setQuiz(lobby.quiz);
	client.ui.setLobby(lobby);
	
	client.ui.setStats(lobby.stats);
};

client.quiz.setQuiz = function(quiz){
	client.quiz.currentQuiz = quiz;
	client.ui.setQuiz(quiz);
};

client.quiz.quizEndOfRound = function(data){
	client.ui.quizEndOfRound(data);
};

client.quiz.status = function(username){

};

client.quiz.update = function(username, status){
	
};

client.quiz.correctAnswer = function(data){
	var correct = data.correct,
		players = data.players,
		stats = data.stats;
		
	client.ui.setStats(stats);
	client.ui.displayAnswers(players, correct);
};client.ui = {};

client.ui.addUser = function(player){
	var pc = 100*player.points/client.quiz.currentQuiz.totalPoints;
	
	var html = '<tr id="player-'+player.id+'" class="player-row">';
		html += '<td>'+player.username+'</td>'
		html += '<td class="progress-cell"><div class="progress-bar" style="width:'+(pc||0)+'%;">'+player.points+' Poäng</div></td>';
        html += '<td><span class="points green"></span></td>';
		html += '</tr>';
		
	$("#result-table > tbody > tr:last").after(html);
};

client.ui.syncPlayers = function(players){
	$(".player-row").fadeOut(function(){
		$(".player-row").remove();
	});
	
	for(var i in players){
		client.ui.addUser(players[i]);
	}
};

client.ui.removeUser = function(id){
	$('#player-'+id).remove();
};

client.ui.hideJoin = function(){
	$("#modal-overlay").fadeOut();
};

client.ui.showJoin = function(){
	$("#modal-overlay").fadeIn();
};

client.ui.showConsole = function(){
	$('#console').show();
};
client.ui.hideConsole = function(){
	$('#console').hide();
};

client.ui.showLogin = function(loginFunc){
	client.ui.setModal('Ange ett användarnamn', '<input id="username-input" type="text" placeholder="Användarnamn"/>', {
		Ok: loginFunc,
	});
	$("#username-input").focus(client.usernameFocus);
};

client.ui.setModal = function(title, content, buttons){
	$(".modal-box > h1").text(title);
	$(".modal-box > .content").html(content);
	$(".modal-box > .footer > .right").empty();
	
	for(var i in buttons){
		var btn = $('<input id="join-button" type="button" value="'+i+'"/>');
		var btnClickEvent = buttons[i];
		btn.click(function(){
			if(btnClickEvent()){
				$("#modal-overlay").fadeOut();
			}
		});
		$(".modal-box > .footer > .right").append(btn);
	}
	
	$("#modal-overlay").fadeIn();
};

client.ui.setLobby = function(data){
	$("#lobby-title").text(data.title || "{no_title}");
};

client.ui.setQuiz = function(data){
	$("#quiz-title").text(data.title);
};

client.ui.setTimeLeft = function(timeLeft){
	client.ui.setCountdown(timeLeft/client.quiz.timeLeft, timeLeft);
};

client.ui.chooseAnswer = function(index){
	$("#answer_list > li").removeClass("active").addClass("disabled");
	$('#answer-'+index).removeClass("disabled").addClass('active');
};

client.ui.setQuestion = function(data){
	$("#lobbyLink").addClass("running");
	$("#question-title").text('Fråga ' + (data.num+1) + ' av ' + client.quiz.currentQuiz.questions + ', Ger ' + data.points + ' Poäng');
	$("#question").text(data.question);
	
	$(".answer-box > h2").text("Välj rätt alternativ");
	
	 client.quiz.timeLeft = data.time;
	 
	 client.ui.showCountdown();
	 client.ui.setCountdown(1, client.quiz.timeLeft);
	 
	$("#answer_list").empty();
	
	for(var i in data.answers){
		var el = $('<li id="answer-' + i + '">' + data.answers[i] + '</li>');
		el.click(function(){
			client.quiz.chooseAnswer($(this).index());
		});
		$("#answer_list").append(el);
	}
	
	$('.player-row').removeClass('correct').removeClass('incorrect');
	
};

client.ui.notifyNextQuestion = function(time){
	$("#lobbyLink").removeClass('running').addClass("blinking");
	client.ui.NextQuestionCountdown(time/1000);

};

client.ui.NextQuestionCountdown = function(time){
	if(time)
		client.ui.timeLeft = time;
		
	$("#quiz-title").text("Nästa fråga om " + client.ui.timeLeft + " sekunder");

	if(client.ui.timeLeft-- == 0){
		$("#lobbyLink").removeClass("blinking").addClass("running");
		$("#quiz-title").text(client.quiz.currentQuiz.title);
	}else
		setTimeout(client.ui.NextQuestionCountdown, 1000);
};

client.ui.setStats = function(stats){
	client.ui.hideCountdown();
	for(var i in stats){
		var st = stats[i],
			pc = 100*(st/client.quiz.currentQuiz.totalPoints);
			
		$('#player-'+i+' .progress-bar').css('width', pc+'%');
		$('#player-'+i+' .progress-bar').text(st + ' Poäng');
	}
};

client.ui.displayAnswers = function(answers, correct){
	
	$('#answer_list > li').addClass('incorrect');
	$('#answer-'+correct).removeClass('incorrect').addClass('correct');
	

	for(var i in answers){
		var an = answers[i];
		if(an == correct){
			$('#player-'+i).addClass('correct');
			$('#player-'+i + ' .points').text('+'+ client.quiz.currentQuestion.points +' Points').fadeIn(800, function(){
				$(this).fadeOut(3000);
			});
		}else
			$('#player-'+i).addClass('incorrect');
			
	}
	
	$('#lobbyLink a > div').hide();
	$('#display-answer').show();
	
	if($('#answer_list > li.active').index() == correct){
		$('#display-answer').addClass('correct').text('Rätt svar!');
		$('#lobbyLink').addClass('green');
	}
	else{
		$('#display-answer').addClass('incorrect').text('Fel svar!');
		$('#lobbyLink').addClass('red');
	}
		
	setTimeout(function(){
		$('#lobbyLink').removeClass('green').removeClass('red');
		$('#display-answer').removeClass('correct').removeClass('incorrect');
		$('#lobbyLink a > div').hide();
		$('#default-msg').show();
	}, 5000);
	
};

client.ui.showCountdown = function(){
	$('#default-msg').hide();
	$('#coundownclock').show();
};

client.ui.hideCountdown = function(){
	$('#coundownclock').hide();
	$('#default-msg').show();
};

client.ui.setCountdown = function(pc, text){
	$('.clock > .display').text(text);
	
	if(pc <= 0.25)
		$('.front.left').css('z-index', 15).css('height', 100+'px');
	else if(pc <= 0.5)
		$('.front.left').css('z-index', 15).css('height', 50+'px');
	else
		$('.front.left').css('z-index', 5);
	
		$('.rotate.left').css('-webkit-transform', 'rotate('+ pc*360 + 'deg)');
		$('.rotate.right').css('-webkit-transform', 'rotate('+ ((pc-0.5)*360) + 'deg)');
	
	if(pc >= 0.5)
		$('.rotate.left').css('-webkit-transform', 'rotate('+ 180 + 'deg)');
};

client.ui.quizEndOfRound = function(results){
	$('#lobbyLink').removeClass('running');
	
	var html = '<table cellspacing="0"><tr>';
	 	html += '<th>Plats</th>';
        html += '<th>Namn</th>';
		html += '<th>Poäng</th>';
		html += '<th>Rätt</th>';
		html += '<th>Fel</th>';
		html += '<th>Rätt/Fel</th>';
		html += '</tr>';
		
		var points = 99999,
			place = 0;
		
		for(var i in results){
			var res = results[i],
				rt = (res.correct / res.incorrect);
				
			rt = rt == Infinity ? res.points : rt;
			
			if(points > res.points){
				points = res.points;
				place++;
			}
				
			html += '<tr class="'+ (place == 1 ? 'winner' : (place == 2 ? 'second' : (place == 3 ? 'third' : '')))+'"><td>'+ place +'</td>';
			html += '<td>'+ res.username +'</td>';
			html += '<td class="green">'+ res.points +'</td>';
			html += '<td class="green">'+ res.correct +'</td>';
			html += '<td class="red">'+ res.incorrect +'</td>';
			html += '<td>' + rt + '</td></tr>';
		}
		
    	html += '</table>';
	
	client.ui.setModal("Resultat", html, {
		Ok: function(){return true;}
	});
	
};

client.ui.quizReset = function(){
	$('.player-row').css('width', 0);
	
	$('#answer_list').empty();
	$("#question-title").text('Väntar på nästa fråga');
	$(".answer-box > h2").text('Väntar på nästa fråga');
	$("#question").text('');
};


$(document).ready(function(e) {
	client.init();
});