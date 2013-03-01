/*********************************************
	Client.UI.js
	View
	Everything that changes onscreen should be generated here

**********************************************/

client.ui = {};


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

