server.aquiz = function(quiz){
	this.id = 0;
	this.title = quiz.title || "";
	this.description = quiz.description || "";
	this.creator = quiz.creator || "";
	this.difficulty = quiz.difficulty || "";
	this.questions = quiz.questions || [];
};

server.aquiz.prototype = {
	getInfo: function(){
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			creator: this.creator,
			difficulty: this.difficulty,
			questions: this.getNumQuestions(),
		}
	},
	
	getNumQuestions: function(){
		return this.questions.length;
	},
};