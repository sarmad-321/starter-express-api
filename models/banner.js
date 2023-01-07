const mongoose = require('mongoose');



const bannerSchema = new mongoose.Schema({
    facilityId   : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Facility"
    },
    Images : {
        type : Array , 
        default : [{
            image : ""
        }]
    }
},
{timestamps : true}    

)

const Banners = mongoose.model('Banners' , bannerSchema )

module.exports = Banners;