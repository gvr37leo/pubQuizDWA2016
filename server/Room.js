class Room{
    constructor(quizMasterWebIO, password){
        this.quizMasterWebIO = quizMasterWebIO;
        this.teams = [];
        this.scoreBoardWebIO;
        this.password = password;
        this.id = Math.floor(Math.random() * 1000);

        this.currentQuestion;
        this.numberOfQuestionsInRound = 3;
        this.selectableQuestions = [];
        this.oldQuestions = [];
        this.currentCategorys = [];
        this.questionCount = 0;
    }

    updateQuizMaster(){//people joined
        this.quizMasterWebIO.send('roomUpdate',{room:this.serialize()})
    }

    updateScoreBoard(){
        if(this.scoreBoardWebIO)this.scoreBoardWebIO.send('roomChanged',{room:this.serialize()})
    }

    updateAnswers(){//people answered
        this.quizMasterWebIO.send('answerchanged',{room:this.serialize()})
    }

    changeSelectableQuestion(QuestionModel){
        this.selectableQuestions = [];
        var querys = [];
        
        for(var category of this.currentCategorys){
            ((category) =>{//iife zodat category bewaard blijft
                querys.push(new Promise((resolve, reject) =>{
                    QuestionModel.find({'category':category, 'question':{$nin:this.oldQuestions}}).lean().exec((err, questions) =>{
                        if(err) throw err;
                        var question = questions[Math.floor(Math.random() * questions.length)]
                        this.selectableQuestions.push(question)
                        this.oldQuestions.push(question.question);
                        resolve();
                    })
                }))
            })(category)
            
        }
        return Promise.all(querys)
    }

    selectQuestion(){
        for(var team of this.teams){
            team.webIO.send('selectQuestion', this.currentQuestion)
        }
        this.quizMasterWebIO.send('selectQuestion', this.currentQuestion)
        this.updateScoreBoard()
    }

    findTeamIndex(id){
        for(var i = 0; i < this.teams.length; i++){
            if(this.teams[i].id == id)return i;
        }
    }

    serialize(){
        var room = {
            password:this.password,
            id:this.id,
            teams:[],
            currentQuestion:this.currentQuestion,
            questionCount:this.questionCount
        }
        for(var team of this.teams){
            room.teams.push(team.serialize())
        }
        return room
    }

    resetTeams(){
        for(var team of this.teams){
            team.approved = false;
            team.answer = '';
        }
    }

    addRoundPoints(){
        this.teams.sort((a, b) =>{
            return a.score - b.score
        })
        var points = [4,2,1]
        for(var i = 0; i < this.teams.length; i++){
            if(i < points.length) this.teams[i].roundPoints += points[i];
            else this.teams[i].roundPoints += 0.1;
        }
    }

}

module.exports = Room;
