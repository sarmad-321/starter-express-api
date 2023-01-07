const mongoose = require('mongoose');



const pitchSchema = new mongoose.Schema({
    name  : String ,
    user : {
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
    maxPlayers : Number,
    
})

const Pitch = mongoose.model('Pitch' , pitchSchema )

module.exports = Pitch;