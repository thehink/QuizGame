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
};

Events.enable.call(client);


client.enableListeners = function(){

	$("#join-button").click(client.join);
	$("#username-input").focus(client.usernameFocus);

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
	console.log("SetPlayer:", data);
};

client.join = function(){
	var username = $("#username-input").val();
	if(username.length > 1){
		client.network.join(username);
	}else{
		alert("Du m√•ste skriva in ett anv√§ndarnamn i rutan");
		$("#username-input").focus().addClass("blinking");
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
	socket.on('quizAnswer', client.network.listeners.quizAnswer);
	socket.on('quizResults', client.network.listeners.quizResults);
	
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
	client.dispatch('connected');
};

client.network.listeners.disconnect = function(data){
	client.network.connected = false;
	client.dispatch('disconnected');
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
				alert("Anv‰ndarnamnet anv‰nds redan!");
				break;
			case 3: 
				alert("Fel pÂ servern!");
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
	/*	data - structure
	
		data = {
			question: "html string",
			aternatives: ["array", "of", "strings"],
			points: 5,
		}
	
	*/
};

client.network.listeners.quizAnswer = function(data){
	client.quiz.correctAnswer(data);
};


client.network.listeners.quizResults = function(data){
};


/*=================================
			Lobby
==================================*/

client.network.listeners.syncPlayers = function(data){
	client.quiz.syncPlayers(data);
};

client.network.listeners.joinLobby = function(data){
	client.ui.setLobby(data);
	client.ui.setQuiz(data.quiz);
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
};

client.quiz.init = function(){

};

client.quiz.join = function(player){
	client.ui.addUser(player.id, player.username);
};

client.quiz.leave = function(id){
	client.ui.removeUser(id);
};

client.quiz.syncPlayers = function(players){
	client.ui.syncPlayers(players);
};

client.quiz.status = function(username){

};

client.quiz.update = function(username, status){
	
};

client.quiz.correctAnswer = function(){
	
};client.ui = {};

client.ui.addUser = function(id, username){
	var html = '<tr id="player-'+id+'" class="player-row">';
		html += '<td>'+username+'</td>'
		html += '<td class="progress-cell"><div class="progress-bar" style="width:0%;">0%</div></td>';
        html += '<td></td>';
		html += '</tr>';
		
	$("#result-table > tbody > tr:last").before(html);
};

client.ui.syncPlayers = function(players){
	$(".player-row").fadeOut(function(){
		$(".player-row").remove();
	});
	
	for(var i in players){
		client.ui.addUser(players[i].id, players[i].username);
	}
};

client.ui.removeUser = function(id){
	$('#player-'+id).remove();
};

client.ui.hideJoin = function(){
	$("#join-row").hide();
};

client.ui.showJoin = function(){
	$("#join-row").show();
};

client.ui.showConsole = function(){
	$('#console').show();
};
client.ui.hideConsole = function(){
	$('#console').hide();
};

client.ui.setLobby = function(data){
	$("#lobby-title").text(data.title || "{no_title}");
};

client.ui.setQuiz = function(data){
	$("#quiz-title").text(data.title);
};

$(document).ready(function(e) {
	client.init();
});