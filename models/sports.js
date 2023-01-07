const mongoose = require('mongoose');



const sportsSchema = new mongoose.Schema({
    name  : String , 
    logo : String,   
})

const Sports = mongoose.model('Sports' , sportsSchema )

module.exports = Sports;