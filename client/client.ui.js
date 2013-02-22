client.ui = {};

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

