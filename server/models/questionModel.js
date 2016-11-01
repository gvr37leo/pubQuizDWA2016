var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    question:String,
    answer:String,
    category:String,
});

var Question = mongoose.model('question', questionSchema);

module.exports = {
    model:Question,
    Schema:questionSchema
};
