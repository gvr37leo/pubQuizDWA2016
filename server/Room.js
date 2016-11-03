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

    startChooseQuestion(QuestionModel){
        return new Promise((resolve, reject) => {
            QuestionModel.find({}).lean().exec((err, questions) =>{
                var randoms = [];
                for(var i = 0; i < 3; i++){
                    randoms.push(questions[Math.floor(Math.random() * questions.length)])
                }
                this.selectableQuestions = randoms;
                this.questionCount++;
                this.resetTeams();

                if(this.questionCount > this.numberOfQuestionsInRound){
                    this.quizMasterWebIO.send('endRound', {});
                    //score op scoreboard laten zien
                }else{
                    this.quizMasterWebIO.send('questions', { questions:randoms})
                    for(var team of this.teams)team.webIO.send('questions', {})
                }
                resolve();
            })
        })
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
}

module.exports = Room;
