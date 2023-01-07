const express = require("express");
const jwt = require("jsonwebtoken");
const router = express();
const moment = require('moment')
const auth =  require('../middlewares/auth');
const Contact = require("../models/contactUs");
const fs = require('fs')

router.post('/' , auth , async(req, res) => {

    var screenshotUrl = ""
    if (req.body.image){ 
        const folderPath = `./images/contact/${req.user.id._id}`
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath)        
        }
        const date = moment().unix()
        var base64Data = req.body.image.replace("data:image/png;base64,", "");
        fs.writeFile(`${folderPath}/${date}.png`, base64Data, 'base64' , function(err) {
            console.log(err);
          })    
           screenshotUrl = `/contact/${req.user.id._id}/${date}.png`
    }

        let contact = new Contact({
            name : req.body.name,
            subject : req.body.subject,
            message : req.body.message,
            requestBy : req.user.id._id,
            attachments : screenshotUrl
        })
        
        await contact.save()
        res.status(200).send({
            status : true ,
            message : "Your request has been sent"
        })
})

router.get('/' , async (req , res) => {
    try {
        const contact = await Contact.find().populate('requestBy')
        res.status(200).send({
          status : true , 
          contacts : contact  
        })
    } catch (error) {
        
    }

})



module.exports = router