const mongoose = require('mongoose');



const hostAcitivtySchema = new mongoose.Schema({
    activityName : String,
    organizer : {
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
   facilityOwner :  {
    type :   mongoose.Schema.Types.ObjectId,
    ref : "User"
},
   confirmed : Number,
   gender : String,
    isPublic : {
        type : Boolean,
        default : true
    },
    isBooking : {
        type : Boolean,
        default : false
    },
    paymentType : String,
    price : Number,
    pitchDetail : String,
    playerJoined : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
    }],
    bookingId : Number,

})

const HostActivity = mongoose.model('u_HostActivity' , hostAcitivtySchema )

module.exports = HostActivity;