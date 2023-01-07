const mongoose = require('mongoose');



const bookActivitySchema = new mongoose.Schema({
    activityName : String,
    organizer : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    },
    bookedBy : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    },
    selectedSport : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "Sports"
    },
     location : Object,
     venueFacility :  Array,
     additionalInfo :  String,
     startTime : String,
     endTime :  String,
     selectedDate : Date,
     skills : String,
     total : Number,
     ageGroup : Object,
     confirmed : Number,
     gender : String,
     isPublic : {
        type : Boolean,
        default : true
    },
    paymentType : String,
    price : String,
    pitchDetail : String,
    playerJoined : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
    }]
})

const BookActivity = mongoose.model('u_BookActivity' , bookActivitySchema )

module.exports = BookActivity;