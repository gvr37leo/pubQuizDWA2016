var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    category:String,
    question:String,
    answer:String
});

var Question = mongoose.model('question', questionSchema);

module.exports = {
    model:Question,
    Schema:questionSchema
};
