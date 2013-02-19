client.ui = {};

client.ui.addUser = function(id, username){
	var html = '<tr id="player-'+id+'">';
		html += '<td>'+username+'</td>'
		html += '<td class="progress-cell"><div class="progress-bar" style="width:0%;">0%</div></td>';
        html += '<td></td>';
		html += '</tr>';
		
	$("#result-table > tbody > tr:last").before(html);
};

client.ui.removeUser = function(id){
	
};

client.ui.hideJoin = function(){
	$("#join-row").hide();
};

client.ui.showJoin = function(){
	$("#join-row").show();
};