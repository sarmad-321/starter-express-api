const mongoose = require('mongoose');



const facilitySchema = new mongoose.Schema({
    name :  String,
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    discount : {
        type : Number , 
        default : 0
    },
    coverPhoto : '',
    location : Object,
    phone : String,
    rating : Number ,
    terms : String,
    socialLinks : Object,
    startingFrom : String,
    venueTimings : [
        {
            type : Object
        }
    ],
    contractTenure : Object,
    venueFacility  : Array,
    availableSport : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Sports"
        }
    ],
    
})

const Facility = mongoose.model('Facility' , facilitySchema )

module.exports = Facility;