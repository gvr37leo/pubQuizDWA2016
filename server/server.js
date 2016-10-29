var mongo = require('mongodb')
var mongoose = require('mongoose')
var express = require('express')
var app = express();
var expressWs = require('express-ws')(app);
var ws = require('ws');
var http = require('http');
var bodyparser = require('body-parser')
var WebIO = require('./webIO')
var port = 8000;

var dbName = 'quiz';
mongoose.connect('mongodb://localhost/' + dbName);
mongoose.Promise = global.Promise;

var server = http.createServer();
var wss = new ws.Server({server: server});
app.use('/', express.static('../public/team'));
app.use('/scoreboard', express.static('../public/scoreboard'));
app.use('/quizmaster', express.static('../public/quizmaster'));
server.on('request', app);
server.listen(port, () => console.log('listening on ' + port))

var Room = require('./Room')
var Team = require('./Team')
var roomMap = {};
var questions = [{id:1, question:'wie', category:'culture'}, {id:2, question:'wat', category:'sport'}, {id:3, question:'waar', category:'science'}]

wss.on('connection', function(socket){
    var webIO = new WebIO(socket);
    var room;
    
    webIO.on('roundStart', (data) => {
        webIO.send('questions', {
                questions:questions
            }
        )
    })

    webIO.on('answerApproved', (data) => {
        var index = room.findTeamIndex(data.id);
        room.teams[index].approved = true;
        room.updateAnswers();
    })

    webIO.on('teamdenied', (data) => {
        var index = room.findTeamIndex(data.id)
        room.teams[index].webIO.close();
        room.teams.splice(index, 1)
        room.updateQuizMaster();
    })

    webIO.on('sendanswer', (data) => {
        var index = room.findTeamIndex(webIO.teamId)
        room.teams[index].answer = data.answer;
        room.updateAnswers();
    })

    webIO.on('selectquestion', (data) => {
        room.currentQuestion = questions.find((entry) => {
            return entry.id == data.id
        })
        room.updateQuestions();
    })

    webIO.on('login', (data) => {

        room = roomMap[data.roomId]
        if(room && room.password == data.password){
            var team = new Team(data.name, webIO);
            room.teams.push(team);
            webIO.teamId = team.id;
            room.updateQuizMaster();
        }
    })

    webIO.on('createRoom', (data) => {
        room = new Room(webIO, data.password);
        webIO.roomId = room.id
        roomMap[room.id] = room;
        room.updateQuizMaster();
    })


    socket.on('close', function(){
        if(webIO.teamId){
            var index = room.findTeamIndex(webIO.teamId)
            var team = room.teams[index];
            room.teams.splice(index, 1);
            try{//doc zegt dat write failures hierdoor niet gecatched worden en de ingebouwde error handling gebruikt moet worden
                room.updateQuizMaster();//disconnecting clients are able to call a dead quizmastersocket causing an error here
            }catch(e){
                console.log('probablye quizmaster already disconnected')
            }
        }
        if(roomMap[webIO.roomId]){
            for(team of room.teams){
                team.webIO.close()
            }
            delete roomMap[webIO.roomId]
        }
    })
})
