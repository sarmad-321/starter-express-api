const express = require("express");
const jwt = require("jsonwebtoken");
const router = express();
const Joi = require("joi");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const {sendEmail} = require('../helpers/email')
const auth = require('../middlewares/auth')
const fs = require('fs')
const _path = require('path')
var requestCountry = require('request-country');

router.post('/register'  ,async (req , res)=> { 
  

    const salt =  await bcrypt.genSalt(10)


    const emailExists = await  Users.findOne({email : req.body.email})
    const phoneExists = await Users.findOne({phone : req.body.phone })

if (emailExists) {
    return res.send({
        statues : false,
        message : "Email Already Exists"
    })
}

if (phoneExists) {
    return res.send({
        statues : false,
        message : "Phone Number Already Exists"
    })
}
    

    const user = new Users({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        companyName : req.body.companyName,
        email : req.body.email,
        phone : req.body.phone,
        password : await bcrypt.hash(req.body.password , salt),
    })

    sendEmail(req.body.email)
    user.save()
    .then(async(response)  => {
     res.status(200).send({
         status : true,
         message : `A confirmation email has been sent to ${response.email} `
     })
    })   
    .catch(ex => res.send(ex))

})

router.post('/updateToken' , auth , async(req , res) => {
    const user = await Users.findById(req.user.id._id)
    user.fcmToken = req.body.fcmToken
    await user.save()
    res.status(200).send({
        status : true ,
        message : "Profile has been successfully updated"
    })
})

router.post('/login' ,async (req , res)=> { 
    const schema = Joi.object({ 
        email : Joi.string(),
        password : Joi.string(),
    })


    const validation = schema.validate(req.body)

    const alreadyExist = await  Users.findOne({email : req.body.email})
    if (!alreadyExist) {
    return res.send({
        status : false ,
        message : "Invalid Email or Password"})
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
                message : "You are not verified by GoPlay yet. Please wait or contact info@go-playapp.com for assistance"
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
    if (!validate) {
        return res.status(200).send({
            status : false ,
            message : "You have entered the wrong old password"})
           }

    const alreadySame = await bcrypt.compare(req.body.newPassword , alreadyExist.password)
    if (alreadySame){ 
        return res.status(200).send({
            status : false ,
            message : "Your have entered the same old password"
        })
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
    const userDetail = await Users.findById(req.user.id._id)
    res.status(200).send({
        status : true ,
        userDetail : userDetail
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
    catch (ex){
        console.log(ex)
    }

})

router.get('/getGlobalUsers'   , async (req,res)=>  {
    const user = await Users.find().select('-password').sort({points: -1})
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
            if (result.approvedByAdmin == false){
                return res.status(200).send({
                    status : false 
                })
            }
           return res.status(200).send({
                status : true 
            })
        }
       else {
      return res.status(200).send({
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