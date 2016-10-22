var mongo = require('mongodb')
var mongoose = require('mongoose')
var express = require('express')
var app = express();
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
app.use('/', express.static('../public/scoreboard'));
app.use('/', express.static('../public/quizmaster'));
server.on('request', app);
server.listen(port, () => console.log(`listening on ${port}`))

// var questionModel = require('./models/question')

wss.on('connection', function(socket){
    socket.on('message', function(data){

    })

    socket.on('close', function(){
        
    })
})
