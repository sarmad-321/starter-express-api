const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({

    user  :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    bookedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
    },
    detailSlotId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "SlotDetail"
    },
    slot  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Slot"
    },
    activityId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "u_HostActivity"
    },
    isFacility : {
        type : Boolean,
        default : false
    },

 
    date : Date,
    timeSlot : Object

} , {timestamps : true})



const Booking = mongoose.model('Booking' , bookingSchema )

module.exports = Booking
