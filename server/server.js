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
var roomMap = {};

wss.on('connection', function(socket){
    var webIO = new WebIO(socket);

    socket.on('message', function(data){

    })

    webIO.on('login', (data) => {
        var room = roomMap[data.roomId]
        if(room.password == data.password){
            room.teamSockets.push({
                socket:socket,
                name:data.name
            });
            room.updateQuizMaster();
        }
    })

    webIO.on('createRoom', (data) => {
        var room = new Room(socket, data.password);
        socket.roomId = room.id
        roomMap[room.id] = room;
        room.updateQuizMaster();
    })


    socket.on('close', function(){
        delete roomMap[socket.roomId]
    })
})
