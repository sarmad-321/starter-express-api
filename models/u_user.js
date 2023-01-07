const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    firstName : {
      type :  String,
      default : ""
    },
    lastName :  {
        type :  String,
        default : ""
      },
    gender :  {
        type :  String,
        default : ""
      },
    age :  {
        type :  Number,
        default : ""
      },
      dob : { 
           type : Object, 
           default : {}
      },
    sportsInterest : [{
        type :   mongoose.Schema.Types.ObjectId,
        ref : "Sports"
      }],
    profilePic : {
        type :  String,
        default : ""
      },
    email : {
        type : String ,
        unique : true
    },
    phone : String,
    points : {
      type : Number,
      default : 10
    },
    password : String,
    verification : {
        type : Boolean,
        default : false
    },
    approvedByAdmin : {
        type : Boolean,
        default : true
    },
    wallet : {
      type : Number ,
      default : 2000
    },

    fcmToken : {
      type : String ,
      default : null
    }
})

const User = mongoose.model('u_User' , userSchema )

module.exports = User;