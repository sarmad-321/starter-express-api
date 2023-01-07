const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    name :  String,
    firstName : {
      type :  String,
      default : ""
    },
    token : String,
    lastName :  {
        type :  String,
        default : ""
      },
    gender :  {
        type :  String,
        default : ""
      },
    companyName :  {
        type :  String,
        default : ""
      },
    address :  {
        type :  String,
        default : ""
      },
    profilePic : {
        type :  String,
        default : ""
      },
    email : {
        type : String ,
        unique : true
    },
    
    phone : String,
    password : String,
    verification : {
        type : Boolean,
        default : false
    },
    
    approvedByAdmin : {
        type : Boolean,
        default : false
    },
    fcmToken : {
      type : String ,
      default : null
    }
})

const User = mongoose.model('User' , userSchema )

module.exports = User;