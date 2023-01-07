const mongoose = require('mongoose');



const conversationSchema = new mongoose.Schema({
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
    },
    isActive : {
        type : Boolean,
        default : false
        } ,
    isGroup : {
        type : Boolean,
        default : false
    },
    isPublicGroup : {
        type : Boolean,
        default : false
    },
    groupName : {
        type : String,
    },
    groupOwner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
    },
    lastMessage : {
        type : String ,
        default : "Tap to start a conversation"
    },
    blockedUser : [{  
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
        }] ,
    members  : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
        }] ,
        testingMembers : Array,
},
{timestamps : true}    

)

const Conversation = mongoose.model('Conversation' , conversationSchema )

module.exports = Conversation;