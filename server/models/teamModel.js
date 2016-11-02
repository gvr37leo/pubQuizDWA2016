var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    id:Number,
    name:String,
    answer:String,
    approved:Boolean,
    score:Number
});

var Team = mongoose.model('team', teamSchema);

module.exports = {
    model:Team,
    schema:teamSchema
};
