var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var teamSchema = require('./teamModel').schema
var questionSchema = require('./questionModel').schema

var roomSchema = new Schema({
    teams:[teamSchema],
    password:String,
    id:String,
    currentQuestion:questionSchema,
    selectableQuestions:[questionSchema],
    questionCount:Number
});

var Room = mongoose.model('room', roomSchema);

module.exports = {
    model:Room,
    schema:roomSchema
};
