client.ui.listLobbies = function(data){
	client.ui.setModal('Lobbies &middot; <input id="create-lobby" type="button" value="Skapa en lobby"/>', '<ul id="list-lobbies" class="lobbies"></ul>', {Ok: function(){
		History.back();
		return true;
	}});
	
	$('#create-lobby').click(function(){
		client.ui.setModal('Skapa lobby', tmpl("create_lobby_tmpl", {}), {Ok: client.quiz.createLobby,
		Avbryt: function(){
			History.back();
			return true;
		}});
	})
	
	
	for(var i in data){
		var html = $(tmpl("lobby_list_tmpl", data[i]).replace(' ',''));
		
		html.click(function(){
			var id = $(this).attr('id').replace('lobby-','');
			History.pushState({state:1}, 'State 3', '/?lobby/'+id);
		});
		
		$('#list-lobbies').append(html);
	}
	
};