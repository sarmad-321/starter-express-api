const mongoose = require('mongoose');

const privacySchema = new mongoose.Schema({
    text  : String , 
    businessApp : Boolean,   
})

const PrivacyPolicy = mongoose.model('Privacy' , privacySchema )

module.exports = PrivacyPolicy;