class Room{
    constructor(quizMasterWebIO, password){
        this.quizMasterWebIO = quizMasterWebIO;
        this.teams = [];
        this.password = password;
        this.id = Math.floor(Math.random() * 1000);

        this.currentQuestion;
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

    startquestion(){
        for(var team of this.teams){
            team.webIO.send('startquestion', this.currentQuestion)
        }
        this.quizMasterWebIO.send('startquestion', this.currentQuestion)
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
}

module.exports = Room;
