const express = require("express");
const jwt = require("jsonwebtoken");
const router = express();
const Joi = require("joi");
const Users = require("../models/u_user");
const bcrypt = require("bcrypt");
const {sendEmail} = require('../helpers/userEmail')
const auth = require('../middlewares/auth').u_auth
const fs = require('fs')
const _path = require('path')
const moment = require("moment")
const b_auth = require('../middlewares/auth')


    router.post('/register'  ,async (req , res)=> { 
    const schema = Joi.object({ 
        firstName  : Joi.string().min(3).required(),
        lastName  : Joi.string().min(3).required(),
        gender : Joi.string(),
        age : Joi.object(),
        email : Joi.string(),
        phone : Joi.string(),
        password : Joi.string(),
    })

    const salt =  await bcrypt.genSalt(10)

    const validation = schema.validate(req.body)

    const alreadyExist = await  Users.findOne({email : req.body.email})
    
    if (alreadyExist) {
    return res.send({
        statues : true,
        message : "User Already Exists"
    })
    }

    var a = moment();
    var b = moment(`${req.body.age.mm}-${req.body.age.yyyy}`, 'MM-YYYY');
    var age = moment.duration(a.diff(b));

    const user = new Users({
        email : req.body.email,
        phone : req.body.phone,
        password : await bcrypt.hash(req.body.password , salt),
        firstName : req.body.firstName,
        lastName : req.body.lastName, 
        gender : req.body.gender,
        dob : req.body.age,
        age : age.years()
    })


 

 if(validation.error ) { 
    return  res.status(400).send(validation.error.details[0].message)
 }  
    
    sendEmail(req.body.email)
    user.save()
    .then(async(response)  => {
        const token = jwt.sign({id : alreadyExist} , "privateKey")

     res.status(200).send({
         status : true,
         message : `A confirmation email has been sent to ${response.email} `,
         token : token
     })
    })   
    .catch(ex => res.send(ex))

})

router.post('/isPhoneExist' , async (req , res)=> { 
    const alreadyExist = await  Users.findOne({phone : req.body.phone})
    if (alreadyExist) {
        return res.status(200).send({
            status : true ,
            message : "Phone Number Already Exists"})
    }else {
        return res.status(200).send({
            status : false ,
        })
    }
})

router.post('/isEmailExist' , async (req , res)=> { 
    const alreadyExist = await  Users.findOne({email : req.body.email})
    if (alreadyExist) {
        return res.status(200).send({
            status : true ,
            message : "Email Already Exists"})
    }else {
        return res.status(200).send({
            status : false ,
        })
    }
})



router.post('/login' ,async (req , res)=> { 
    const schema = Joi.object({ 
        phone : Joi.string(),
        password : Joi.string(),
    })


    const validation = schema.validate(req.body)

    const alreadyExist = await  Users.findOne({phone : req.body.phone})
    if (!alreadyExist) {
    return res.send({
        status : false ,
        message : "Invalid Phone or Password"})
}
    const validate = await bcrypt.compare(req.body.password , alreadyExist.password )
        if (!validate) {
            return res.send({
                status : false ,
                message : "Invalid Email or Password"})
               }

        if(validation.error ) { 
            return  res.status(400).send(validation.error.details[0].message)
         }  

         if (!alreadyExist.verification) {
             return res.status(200).send({
                status  : false,
                message : "Please verify your email first to log in"
            })
         }
         if(!alreadyExist.approvedByAdmin) {
            return res.status(200).send({
                status  : false,
                message : "Your account has been suspended by the GoPlay Administration. Please email at support@go-playapp.com for further information"
            })
         }
         const token = jwt.sign({id : alreadyExist} , "privateKey")
         res.status(200).send({
            status : true, 
            token : token})
       

})

router.post('/changePass' , auth ,  async (req , res) => {
    const salt =  await bcrypt.genSalt(10)

    const alreadyExist = await  Users.findById(req.user.id._id)
    const validate = await bcrypt.compare(req.body.oldPassword , alreadyExist.password )
    const alreadySame = await bcrypt.compare(req.body.newPassword , alreadyExist.password)
    if (alreadySame){ 
        return res.status(200).send({
            status : false ,
            message : "Your have entered the same old password"
        })
    }
    if (!validate) {
        return res.status(200).send({
            status : false ,
            message : "You have entered the wrong old password"})
           }
           alreadyExist.password = await bcrypt.hash(req.body.newPassword , salt),

           await alreadyExist.save()
           res.status(200).send({
               status : true ,
               message : "Your password has been successfully changed"
           })
} )

router.post('/verifyNumber' , async(req,res)=> {
    const salt = await bcrypt.genSalt(10)

    const alreadyExist = await Users.findOne({
        phone : req.body.phone
    })
    if (alreadyExist){
        return res.status(200).send({
            status : true
        })
    }
    if(!alreadyExist){
      return  res.status(200).send({
            status : false,
            message : "There is no account registered against this number"
        })
    }    
})

router.post('/forgetPass'  , async(req,res)=> {
    const salt = await bcrypt.genSalt(10)
    const alreadyExist = await Users.findOne({
        phone : req.body.phone
    })
    if(!alreadyExist){
      return  res.status(200).send({
            status : false,
            message : "There is no account registered against this number"

        })
    }
    alreadyExist.password = await bcrypt.hash(req.body.password , salt) 
    await alreadyExist.save()
    res.status(200).send({
        status : true ,
        message : "Your password has been successfully changed"
    })  
})

router.get('/confirmation' , async(req , res) => {
    const email = Buffer.from(req.query.email, 'base64').toString('ascii')
    let result = await Users.findOne({email : email})
    result.verification = true 
    result.save()
    res.send(
        "<br/> </br> <h1>You have been successfully verified</h1>"
    )
})

router.get('/userDetail' , auth ,  async(req, res)=> {
    const userDetail = await Users.findById(req.user.id._id).populate("sportsInterest").select('-password')
    res.status(200).send({
        status : true ,
        userDetail : userDetail
    })
})

router.post('/updateSports'  , async(req,res)=> {
    const user = await Users.findOne({phone : req.body.phone})
    user.sportsInterest = req.body.sportsInterest
    await user.save()
    res.status(200).send({
        status : true ,
        message : "Sports has been successfully added"
    })
})

router.post('/updateProfile' , auth , async(req , res) => {
    const randomNumber = Math.floor(Math.random() * 100);
    const folderPath = `./images/profile/${req.user.id._id}`
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath)        
    }else{
        fs.readdir(folderPath, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(_path.join(folderPath, file), err => {
                if (err) throw err;
              });
            }
          });
    }
    var a = moment();
var b = moment(`${req.body.dob.mm}-${req.body.dob.yyyy}`, 'MM-YYYY');
var age = moment.duration(a.diff(b));

let tempArr = []
req.body.sportsInterest.forEach(element => {
        tempArr.push(element._id)
});


    const user = await Users.findById(req.user.id._id)

    if (user.phone !== req.body.phone) { 
        const alreadyExist = await Users.findOne({
            phone : req.body.phone
        })
        if (alreadyExist){
            return  res.status(200).send({
                status : false,
                message : "There is another account registered against this number"
            })
        }
    }

    user.firstName = req.body.firstName,
    user.lastName = req.body.lastName,
    user.gender = req.body.gender,
    user.companyName = req.body.companyName,
    user.phone = req.body.phone,
    user.address = req.body.address
    user.dob = req.body.dob,
    user.age = age.years(),
    user.sportsInterest = tempArr

    if (req.body.profilePic.length > 200) { 
        var base64Data = req.body.profilePic.replace("data:image/png;base64,", "");
        fs.writeFile(`${folderPath}/profilepic${randomNumber}.png`, base64Data, 'base64' , function(err) {
            console.log(err);
          })    
          var path = 
          user.profilePic = `/profile/${req.user.id._id}/profilepic${randomNumber}.png`
    }

    await user.save()
    res.status(200).send({
        status : true ,
        message : "Profile has been successfully updated"
    })

}
)

router.post('/updateToken' , auth , async(req , res) => {
    const user = await Users.findById(req.user.id._id)
    user.fcmToken = req.body.fcmToken
    await user.save()
    res.status(200).send({
        status : true ,
        message : "Profile has been successfully updated"
    })
})

router.get('/getAllUsers' , auth , b_auth , async (req,res)=>  {
        const user = await Users.find({
            _id : {$ne : req.user.id._id}
        }).select('-password').populate('sportsInterest')
        res.status(200).send({
            status : true ,
            users : user
        })
})

router.post('/approvedUser'   , async (req,res)=>  {
    try {
        const user = await Users.findById(req.body.userId)
        if (user) {
            user.approvedByAdmin = req.body.verify
            await user.save()
        }
    
        res.status(200).send({
            status : true ,
            message : "Verification has been submitted"
        })
    }
    catch(ex) {
        console.log(ex)
    }

})

router.get('/getGlobalUsers'   , async (req,res)=>  {
    const user = await Users.find().select('-password').populate('sportsInterest').sort({points: -1})
    res.status(200).send({
        status : true ,
        users : user
    })
})

router.get('/verifyToken'   , async (req,res)=>  {
    const token = req.header('Authorization').split("Bearer ")[1]
    if (!token) {
        return res.status(200).send({
            status : false
        })
    }
    try {
        const decoded = jwt.verify(token , 'privateKey')
        let result = await Users.findById(decoded.id)
        if(result){
            req.user = decoded
            res.status(200).send({
                status : true 
            })
        }
       else {
        res.status(200).send({
            status : false 
        })
           }
    }
    catch (ex) { 
        res.status(200).send({
            status : false 
        })
    }
})

module.exports = router;