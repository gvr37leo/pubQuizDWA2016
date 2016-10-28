class Room{
    constructor(quizMasterWebIO, password){
        this.quizMasterWebIO = quizMasterWebIO;
        this.teams = [];
        this.password = password;
        this.id = Math.floor(Math.random() * 1000);
        this.currentQuestion;
    }

    updateQuizMaster(){
        this.quizMasterWebIO.send('roomUpdate',{
                room:this.serialize()
            }
        )
    }

    updateQuestions(){
        for(var team of this.teams){
            team.webIO.send('questionUpdate', this.currentQuestion)
        }
    }

    serialize(){
        var room = {
            password:this.password,
            id:this.id,
            teams:[]
        }
        for(var team of this.teams){
            room.teams.push({name:team.name})
        }
        return room
    }
}

module.exports = Room;
