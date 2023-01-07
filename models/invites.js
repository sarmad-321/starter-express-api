const mongoose = require('mongoose');



const activityInvitesSchema = new mongoose.Schema({
    invitedBy : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    },
    InvitedList : [{
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    }],
    activity : { 
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_HostActivity"
    },
    eventDate : Date
}
,{timestamps : true}    

)

const activityInvites = mongoose.model('u_activityInvites' , activityInvitesSchema )

module.exports = activityInvites;