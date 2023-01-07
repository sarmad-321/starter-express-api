const mongoose = require('mongoose');



const offersSchema = new mongoose.Schema({
    facilityId   : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Facility"
    },
    discount : {
        type : String,
    }
},
{timestamps : true}    

)

const Offers = mongoose.model('Offers' , offersSchema )

module.exports = Offers;