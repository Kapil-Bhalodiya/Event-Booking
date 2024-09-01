const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type : String,
        required: true
    },
    emailId : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : false
    },
    createdEvents : [{
        type : Schema.Types.ObjectId,
        ref : 'Event'
    }]
})

module.exports = mongoose.model('User', userSchema);