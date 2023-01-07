const mongoose = require('mongoose');


const slotSchema = new mongoose.Schema({
    name  : String ,
    user  :   {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    sport  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Sports'
    },
    facility : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Facility'
    },
    pitch :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Pitch'
    },
    date : {
        type : Object
    },
    days  : Array,
    slot : [{
        type : Object
    }]
    
})

const detailedSchema =  new mongoose.Schema({

    slot  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Slot'
    },
    date : String ,
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
            },
    facility : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Facility'
    },
    sport  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Sports'
    },
    pitch : 
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Pitch' 
        },

    detail : [
        {
           from : Date,
            to : Date ,
            price : String,
            booked : {
                type : Boolean , 
                default : false
            },
            blocked : {
                type : Boolean , 
                default : false
            }
        }
    ]
  
    
})

const Slot = mongoose.model('Slot' , slotSchema )
const detailedSlots = mongoose.model('SlotDetail' , detailedSchema)

module.exports.Slots = Slot
module.exports.detailedSlots = detailedSlots