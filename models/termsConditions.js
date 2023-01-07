const mongoose = require('mongoose');

const termsSchema = new mongoose.Schema({
    text  : String , 
    businessApp : Boolean,   
})

const TermsConditions = mongoose.model('TermsCondition' , termsSchema )

module.exports = TermsConditions;