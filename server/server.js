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
mongoose.Promise = global.Promise;
var QuestionModel = require('./models/QuestionModel').model
var categorys;
QuestionModel.distinct('category').lean().exec((err, categorysArray) =>{
    categorys = categorysArray;
})
mongoose.connect('mongodb://localhost/' + dbName, (err) => {
    if(err)throw err;
    console.log('connected to mongo')
});

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
        room.changeSelectableQuestion(QuestionModel).then((result) => {
            webIO.routeMap = states.selectingQuestion;
            if(room.questionCount >= room.numberOfQuestionsInRound){//round over
                webIO.routeMap = states.stopContinue;
                room.quizMasterWebIO.send('endRound', {});
                room.questionCount = 0;
                room.oldQuestions = [];
                room.currentCategorys = getRandomInts(3,0,categorys.length).map((entry) =>{
                    return categorys[entry]
                })
                for(var team of room.teams)team.score = 0;
                room.addRoundPoints();
                room.updateScoreBoard();
            }
            else{
                room.quizMasterWebIO.send('questions', { questions:room.selectableQuestions})
                for(var team of room.teams)team.webIO.send('questions', {})
                webIO.routeMap = states.selectingQuestion;
            }
            room.questionCount++;
            room.resetTeams();
        })
    }

    var states = {
        initial:{
            createRoom: (data) => {
                room = new Room(webIO, data.password);
                room.currentCategorys = getRandomInts(3,0,categorys.length).map((entry) =>{
                    return categorys[entry]
                })
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
                    room.updateScoreBoard();

                }else{
                    webIO.close();
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
                roundStartFunc()
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

function getRandomInts(amount, start, end){
    if(amount > end-start){
        throw Error("No you are not allowed to do this");
    }
    var startList = [];
    for(var i = start;i<end;i++){
        startList.push(i);
    }
    var intList = [];
    
    for(var i = 0; i < amount; i++){
        var randomInt = Math.floor(Math.random()*startList.length);
        intList.push(startList[randomInt]);
        startList.splice(randomInt, 1);
    }
    return intList;
}