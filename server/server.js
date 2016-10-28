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

    webIO.on('roundStart', (data) => {
        webIO.send('questions', {
                questions:questions
            }
        )
    })

    webIO.on('selectquestion', (data) => {
        var room = roomMap[webIO.roomId]
        room.currentQuestion = questions.find((entry) => {
            return entry.id == data.id
        })
        room.updateQuestions();
        console.log(data)
    })

    webIO.on('login', (data) => {
        var room = roomMap[data.roomId]
        if(room.password == data.password){
            room.teams.push(new Team(data.name, webIO));
            room.updateQuizMaster();
        }
    })

    webIO.on('createRoom', (data) => {
        var room = new Room(webIO, data.password);
        webIO.roomId = room.id
        roomMap[room.id] = room;
        room.updateQuizMaster();
    })


    socket.on('close', function(){
        delete roomMap[webIO.roomId]
    })
})
