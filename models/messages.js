const mongoose = require('mongoose');



const messagesSchema = new mongoose.Schema({
    convesationId  : {
        type : String,
    } ,
    sender : {
        type : String,
    },
    senderName : {
        type : String
    },
    text : {
        type : String
    }
},
{timestamps : true}    

)

const Messages = mongoose.model('Messages' , messagesSchema )

module.exports = Messages;