const mongoose = require('mongoose');



const venueFacilitySchema = new mongoose.Schema({
    name  : String , 
    logo : String,   
})

const VenueFacility = mongoose.model('VenueFacility' , venueFacilitySchema )

module.exports = VenueFacility;