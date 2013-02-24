/*********************************************
	Client.UI.js
	View
	Everything that changes onscreen should be generated here

**********************************************/

client.ui = {};
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
				rt = res.incorrect == 0 ? (res.correct / res.incorrect) : res.correct; 	//Do not divide by zero
			
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


