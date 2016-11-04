var mongo = require('mongodb')
var mongoose = require('mongoose')
var express = require('express')
var app = express();
var expressWs = require('express-ws')(app);
var session = require('express-session');
var ws = require('ws');
var http = require('http');
var bodyparser = require('body-parser')
var WebIO = require('./webIO')
var port = 8000;
var dbName = 'pubquiz';

var QuestionModel = require('./models/questionModel').model
mongoose.connect('mongodb://localhost/' + dbName, (err, database) => {
		if(err) throw err;
		db = database;
});
mongoose.Promise = global.Promise;

app.use(session({resave: true, saveUninitialized: true, secret: 'banaan', cookie: { maxAge: 600000 }}));
app.get('*',function(req,res,next){
	req.session.test = "Test1";
	next();
});
app.use('/', express.static('../public/team'));
app.use('/scoreboard', express.static('../public/scoreboard'));
app.use('/quizmaster', express.static('../public/quizmaster'));

app.listen(port, () => console.log('listening on ' + port))

var Room = require('./Room')
var Team = require('./Team')

var roomMap = {};

app.ws('/', function(socket,req){
		var room;
		for(var item in roomMap){
			for(var team of roomMap[item].teams){
				if(team.webIO.sessionID==req.sessionID){
					room = roomMap[item];
					team.webIO.socket = socket;
					team.webIO.setupSocket();
					if(team.webIO.lastMessage=="NOPE"){
						team.webIO.send('questions',{});
					}else{
						team.webIO.sendLastMessage();
					}
					return;
				}
			}
		}
		var webIO = new WebIO(socket);
		webIO.sessionID = req.sessionID;

    var roundStartFunc = (data) => {
        room.startChooseQuestion(QuestionModel).then((result) => {
            webIO.routeMap = states.selectingQuestion;
            if(room.questionCount > room.numberOfQuestionsInRound){
                webIO.routeMap = states.stopContinue;
                room.questionCount = 0;
                //add roundPoints
            }
            else{
                webIO.routeMap = states.selectingQuestion;
            }
        })
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
                    /*webIO.onclose = () => {
                        var index = room.findTeamIndex(webIO.teamId)
                        var team = room.teams[index];
                        room.teams.splice(index, 1);
                        try{//doc zegt dat write failures hierdoor niet gecatched worden en de ingebouwde error handling gebruikt moet worden
                            room.updateQuizMaster();//disconnecting clients are able to call a dead quizmastersocket causing an error here
                        }catch(e){
                            console.log('probably quizmaster already disconnected')
                        }
                    }*/
                }
            },

            scoreBoardLogin:(data) => {
                room = roomMap[data.roomId]
                if(room && room.password == data.password){
                    room.scoreBoardWebIO = webIO;
                    room.updateScoreBoard()
                }
                webIO.onclose = () => {

                }
            }
        },

        approvingTeams:{
            teamdenied:(data) => {
                var index = room.findTeamIndex(data.id)
                room.teams[index].webIO.close();
                room.teams.splice(index, 1)
                room.updateQuizMaster();
                room.updateScoreBoard()
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
								room.updateAnswers();
                webIO.routeMap = states.approvingQuestions;
            }
        },

        approvingQuestions:{
            answerApproved:(data) => {
                var index = room.findTeamIndex(data.id);
                room.teams[index].approved = true;
                room.teams[index].score++;
                room.updateAnswers();
                room.updateScoreBoard()
            },

            roundStart:roundStartFunc
        },

        stopContinue:{
            continue:(data) => {
                room.startChooseQuestion(QuestionModel);
                webIO.routeMap = states.selectingQuestion;
            },

            stop:(data) => {
                webIO.routeMap = states.initial;
								for(team of room.teams){
										team.webIO.close();
								}
								delete roomMap[webIO.roomId];
            }
        },

        listenToAnswers:{
            sendanswer:(data) => {
                var index = room.findTeamIndex(webIO.teamId);
								if(room.teams[index].answer!=data.answer){
									if(room.teams[index].approved){
										room.teams[index].score--;
									}
									room.teams[index].approved = false;
	                room.teams[index].answer = data.answer;
	                room.updateAnswers();
								}
            }
        }
    }

    webIO.routeMap = states.initial;
});
