client.ui.listLobbies = function(data){
	client.ui.setModal('Lobbies &middot; <a href="#">Skapa en lobby</a>', '<ul id="list-lobbies" class="lobbies"></ul>', {Ok: function(){
		History.back();
		return true;
	}});
	
	
	for(var i in data){
		var html = $(tmpl("lobby_list_tmpl", data[i]).replace(' ',''));
		
		html.click(function(){
			var id = $(this).attr('id').replace('lobby-','');
			History.pushState({state:1}, 'State 3', '/?lobby/'+id);
		});
		
		$('#list-lobbies').append(html);
	}
	
};