var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    category:{
        type:String,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
});

var Question = mongoose.model('question', questionSchema);

module.exports = {
    model:Question,
    Schema:questionSchema
};
