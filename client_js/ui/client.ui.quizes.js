client.ui.setQuizesPage = function(category, quizes){
	$("#main-content").addClass('browse-page');
	$('#main-content').html(tmpl("quizes_tmpl", {}));
};

client.ui.listQuizes = function(data){
	$('#main-content .items').empty();
	
	for(var i in data){
		var html = tmpl("quiz_list_tmpl", data[i]);
		var quiz = $(html.replace(' ',''));
		quiz.click(function(){
			History.pushState({state:1}, 'State 3', '/?lobbies/'+$(this).attr('id').replace('quiz-', ''));
			return false;
		});

		$('#main-content .items').append(quiz);
	}
	
};
