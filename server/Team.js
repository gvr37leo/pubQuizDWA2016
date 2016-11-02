class Team {
    constructor(name, webIO) {
        this.id = Math.floor(Math.random() * 1000);
        this.name = name;
        this.webIO = webIO;
        this.answer;
        this.approved = false;
        this.score = 0;
        this.roundPoints = 0;
    }

    serialize(){
        return {
            id:this.id,
            name: this.name,
            answer: this.answer,
            approved:this.approved
        }
    }
}

module.exports = Team;
