var mongo = require('mongodb')
var mongoose = require('mongoose')
var express = require('express')
var app = express();
var expressWs = require('express-ws')(app);
var ws = require('ws');
var http = require('http');
var bodyparser = require('body-parser')
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
server.listen(port, () => console.log(`listening on ${port}`))

var Room = require('./Room')
var rooms = [];

wss.on('connection', function(socket){
    socket.on('message', function(data){
        
        console.log(data)
        rooms.push(new Room(socket, data.password))
    })

    socket.on('close', function(){

    })
})
