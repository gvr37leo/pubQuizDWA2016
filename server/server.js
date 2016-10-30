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

    webIO.on('createRoom', (data) => {//quizmaster
        room = new Room(webIO, data.password);
        webIO.roomId = room.id
        roomMap[room.id] = room;
        room.updateQuizMaster();
    })

    webIO.on('login', (data) => {//team
        room = roomMap[data.roomId]
        if(room && room.password == data.password){
            var team = new Team(data.name, webIO);
            room.teams.push(team);
            webIO.teamId = team.id;
            room.updateQuizMaster();
        }
    })

    webIO.on('teamdenied', (data) => {//quizmaster
        var index = room.findTeamIndex(data.id)
        room.teams[index].webIO.close();
        room.teams.splice(index, 1)
        room.updateQuizMaster();
    })

    webIO.on('roundStart', (data) => {//quizmaster
        // get random questions from categorys
        webIO.send('questions', {
                questions:questions
            }
        )
    })

    webIO.on('selectquestion', (data) => {//quizmaster
        room.currentQuestion = questions.find((entry) => {
            return entry.id == data.id
        })
        room.startquestion();
    })

    webIO.on('sendanswer', (data) => {//team
        var index = room.findTeamIndex(webIO.teamId)
        room.teams[index].answer = data.answer;
        room.updateAnswers();
    })

    webIO.on('answerApproved', (data) => {//quizmaster
        var index = room.findTeamIndex(data.id);
        room.teams[index].approved = true;
        room.teams[index].score++;
        room.updateAnswers();
    })

    webIO.on('nextQuestion', (data) => {
        room.questionCount++;

        for(team of room.teams){
            team.approved = false;
            team.answer = '';
        }
        if(room.questionCount > 3){
            //continue or restart
        }else{
            webIO.send('questions', {
                    questions:questions
                }
            )
        }

    })

    socket.on('close', function(){//quizmaster && team
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
