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

    webIO.on('sendanswer', (data) => {

    })

    webIO.on('selectquestion', (data) => {
        room.currentQuestion = questions.find((entry) => {
            return entry.id == data.id
        })
        room.updateQuestions();
        console.log(data)
    })

    webIO.on('login', (data) => {

        room = roomMap[data.roomId]
        if(room && room.password == data.password){
            room.teams.push(new Team(data.name, webIO));
            webIO.teamName = data.name;
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
        if(webIO.teamName){//maybe room.teams een map maken voor snelle lookup om dit geloop te voorkomen
            for(var i = 0; i < room.teams.length; i++){
                var team = room.teams[i];
                if(team.name == webIO.teamName){
                    room.teams.splice(i, 1);
                    try{//doc zegt dat write failures hierdoor niet gecatched worden en de ingebouwde error handling gebruikt moet worden
                        room.updateQuizMaster();//disconnecting clients are able to call a dead quizmastersocket causing an error here
                    }catch(e){
                        console.log('probablye quizmaster already disconnected')
                    }
                    break;
                }
            }
        }
        if(roomMap[webIO.roomId]){
            for(team of room.teams){
                team.webIO.socket.close()
            }
        }
        delete roomMap[webIO.roomId]
    })
})
