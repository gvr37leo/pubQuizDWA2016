class Room{
    constructor(quizMasterWebIO, password){
        this.quizMasterWebIO = quizMasterWebIO;
        this.teams = [];
        this.password = password;
        this.id = Math.floor(Math.random() * 1000);

        this.currentQuestion;
        this.selectableQuestions = [];
        this.questionCount = 0;
    }

    updateQuizMaster(){
        this.quizMasterWebIO.send('roomUpdate',{
                room:this.serialize()
            }
        )
    }

    updateAnswers(){
        this.quizMasterWebIO.send('answerchanged',{
                room:this.serialize()
            }
        )
    }

    startChooseQuestion(QuestionModel){
        QuestionModel.find({}).lean().exec((err, questions) =>{
            var randoms = [];
            for(var i = 0; i < 3; i++){
                randoms.push(questions[Math.floor(Math.random() * questions.length)])
            }
            this.selectableQuestions = randoms;
            this.questionCount++;
            this.resetTeams();

            if(this.questionCount > 3){
                this.quizMasterWebIO.send('endRound', {});
                //score op scoreboard laten zien
            }else{
                this.quizMasterWebIO.send('questions', { questions:randoms})
                for(var team of this.teams)team.webIO.send('questions', {})
            }
        })
    }

    selectQuestion(){
        for(var team of this.teams){
            team.webIO.send('selectQuestion', this.currentQuestion)
        }
        this.quizMasterWebIO.send('selectQuestion', this.currentQuestion)
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
            teams:[]
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
