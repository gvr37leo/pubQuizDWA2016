class Room{
    constructor(quizMasterSocket, password){
        this.quizMasterSocket = quizMasterSocket;
        this.teamSockets = [];
        this.password = password;
        this.id = Math.floor(Math.random() * 1000);
    }

    static findRoom(rooms, id){
        for(room of rooms)if(room.id == id)return room;
        return null;
    }
}

module.exports = Room;
