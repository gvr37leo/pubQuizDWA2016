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

var dbName = 'pubquiz';

var QuestionModel = require('./models/questionModel').model
mongoose.connect('mongodb://localhost/' + dbName, (err) => {
    console.log('connected to mongo')
});
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

wss.on('connection', function(socket){
    var webIO = new WebIO(socket);
    var room;

    var roundStartFunc = (data) => {
        room.startChooseQuestion(QuestionModel);
        webIO.routeMap = states.selectingQuestion;
    }

    var states = {
        initial:{
            createRoom: (data) => {
                room = new Room(webIO, data.password);
                webIO.roomId = room.id
                roomMap[room.id] = room;
                room.updateQuizMaster();
                webIO.routeMap = states.approvingTeams;
                webIO.onclose = () => {
                    for(team of room.teams){
                        team.webIO.close()
                    }
                    delete roomMap[webIO.roomId]
                }
            },
            
            login:(data) => {
                room = roomMap[data.roomId]
                if(room && room.password == data.password){
                    var team = new Team(data.name, webIO);
                    room.teams.push(team);
                    webIO.teamId = team.id;
                    room.updateQuizMaster();
                    webIO.routeMap = states.listenToAnswers; 
                    webIO.onclose = () => {
                        var index = room.findTeamIndex(webIO.teamId)
                        var team = room.teams[index];
                        room.teams.splice(index, 1);
                        try{//doc zegt dat write failures hierdoor niet gecatched worden en de ingebouwde error handling gebruikt moet worden
                            room.updateQuizMaster();//disconnecting clients are able to call a dead quizmastersocket causing an error here
                        }catch(e){
                            console.log('probably quizmaster already disconnected')
                        }
                    }
                }
            }
        },

        approvingTeams:{
            teamdenied:(data) => {
                var index = room.findTeamIndex(data.id)
                room.teams[index].webIO.close();
                room.teams.splice(index, 1)
                room.updateQuizMaster();
            },

            roundStart:roundStartFunc,

            close:() => {
                console.log('closed')
            }
        },

        selectingQuestion:{
            selectquestion:(data) => {
                room.currentQuestion = room.selectableQuestions[data.index];
                room.selectQuestion();
                webIO.routeMap = states.approvingQuestions;
            }
        },

        approvingQuestions:{
            answerApproved:(data) => {
                var index = room.findTeamIndex(data.id);
                room.teams[index].approved = true;
                room.teams[index].score++;
                room.updateAnswers();
            },

            roundStart:roundStartFunc
        },

        stopContinue:{
            continue:(data) => {
                room.questionCount = 0;
                room.startChooseQuestion(QuestionModel);
                webIO.routeMap = states.selectingQuestion;
            },

            stop:(data) => {
                room.questionCount = 0;
                webIO.routeMap = states.initial;
            }
        },

        listenToAnswers:{
            sendanswer:(data) => {
                var index = room.findTeamIndex(webIO.teamId)
                room.teams[index].answer = data.answer;
                room.updateAnswers();
            }
        }
    }

    webIO.routeMap = states.initial;
})
