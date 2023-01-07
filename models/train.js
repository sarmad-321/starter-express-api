const mongoose = require('mongoose');



const trainSchema = new mongoose.Schema({
    name  : String , 
    description : String,   
    location : Object,
    facebook : String,
    individual : {
        type :Boolean,
        default : false
    },
    coverPhoto : {
        type : String ,
        default : ""
    },
    whatsApp : String,
    google : String,
    website : String
})

const Sports = mongoose.model('Train' , trainSchema )

module.exports = Sports;