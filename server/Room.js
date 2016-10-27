class Room{
    constructor(quizMasterSocket, password){
        this.quizMasterSocket = quizMasterSocket;
        this.teamSockets = [];
        this.password = password;
        this.id = Math.floor(Math.random() * 1000);
    }

    updateQuizMaster(){
        this.quizMasterSocket.send(
            JSON.stringify({
                type:'roomUpdate',
                room:this.serialize()
            })
        )
    }

    serialize(){
        var room = {
            password:this.password,
            id:this.id,
            teams:[]
        }
        for(var team of this.teamSockets){
            room.teams.push({name:team.name})
        }
        return room
    }
}

module.exports = Room;
