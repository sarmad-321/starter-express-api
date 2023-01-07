const mongoose = require('mongoose');



const contactSchema = new mongoose.Schema({
    name  : {
        type : String,
    } ,
    subject : {
        type : String,
    },
    message : {
        type : String
    },
    requestBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'u_User'
    },
    attachments : {
        type :  String,
        default : ""
      },
},
{timestamps : true}    

)

const Contact = mongoose.model('u_Contact' , contactSchema )

module.exports = Contact;