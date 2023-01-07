const express = require("express");
const router = express();
const Joi = require("joi");
const Facility = require("../models/facility");
const jwt = require("jsonwebtoken");
const auth = require('../middlewares/auth')
const moment = require('moment')
const fs = require('fs')

router.post('/add' , auth , async (req , res)=> {
    let alreadyExist = await Facility.findOne({name : req.body.name})
    if (alreadyExist){
        return res.status(200).send({
            status : false , 
            message : "Facility already exists"
        })
    }

    const randomNumber = Math.floor(Math.random() * 100);
    const folderPath = `./images/facility/${req.user.id._id}`
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath)        
    }
    const date = moment().unix()
    var base64Data = req.body.coverPhoto.replace("data:image/png;base64,", "");
    fs.writeFile(`${folderPath}/${date}.png`, base64Data, 'base64' , function(err) {
        console.log(err);
      })    
      const coverPhotoURL = `/facility/${req.user.id._id}/${date}.png`



    let facility = new Facility({
        name :  req.body.name,
        user : req.user.id._id,
        coverPhoto : coverPhotoURL,
        location :  req.body.location,
        phone :  req.body.phone,
        socialLinks :  req.body.socialLinks,
        terms : req.body.terms,
        startingFrom : req.body.startingFrom,
        venueTimings :  req.body.venueTimings,
        contractTenure :  req.body.contractTenure,
        venueFacility  :  req.body.venueFacility,
        availableSport :  req.body.availableSport,
    })

    try{
       await facility.save()
       res.status(200).send({
        status : true,
        message: "Successfully submitted",
    });
    }
    catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
})


router.get('/get' , auth, async(req , res) => {
    try{
        let data = await Facility.find({
            user :  req.user.id._id
        }).populate('availableSport')
        
        res.status(200).send({
            status : true,
            facilities : data
        })
    }
    catch {
        res.status(400).send({
            status : false,
            message: "something went wrong",
        });
    }

})

router.get('/getAll' , async(req , res) => {
    try{
        let data = await Facility.find().populate('availableSport user')
        
        res.status(200).send({
            status : true,
            facilities : data
        })
    }
    catch {
        res.status(400).send({
            status : false,
            message: "something went wrong",
        });
    }

})


router.post('/getByUser' , async(req , res) => {
    try{
        let data = await Facility.find({user : req.body.user}).populate('availableSport user')    
        res.status(200).send({
            status : true,
            facilities : data
        })
    }
    catch {
        res.status(400).send({
            status : false,
            message: "something went wrong",
        });
    }

})

router.post('/addRating' , async(req , res) => {
    try{
        let data = await Facility.findById(req.body.facility)
        data.rating = req.body.rating
        await data.save()

        res.status(200).send({
            status : true,
            message : "Rating added successfully"
        })
    }
    catch {
        res.status(400).send({
            status : false,
            message: "something went wrong",
        });
    }

})


router.post('/edit' , auth , async(req , res)=> {
    let alreadyExist = await Facility.findById( req.body.id)


    const randomNumber = Math.floor(Math.random() * 100);
    const folderPath = `./images/facility/${req.user.id._id}`
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath)        
    }
    const date = moment().unix()
    if (req.body.coverPhoto.length > 200){
        var base64Data = req.body.coverPhoto.replace("data:image/png;base64,", "");
        fs.writeFile(`${folderPath}/${date}.png`, base64Data, 'base64' , function(err) {
            console.log(err);
          })    
           const coverPhotoURL = `/facility/${req.user.id._id}/${date}.png`
           alreadyExist.coverPhoto = coverPhotoURL

    }
    alreadyExist.name =  req.body.name
    alreadyExist.user = req.user.id._id
    alreadyExist.location =  req.body.location
    alreadyExist.phone =  req.body.phone
    alreadyExist.socialLinks =  req.body.socialLinks
    alreadyExist.venueTimings =  req.body.venueTimings
    alreadyExist.terms = req.body.terms,
    alreadyExist.startingFrom = req.body.startingFrom,
    alreadyExist.contractTenure =  req.body.contractTenure
    alreadyExist.venueFacility  =  req.body.venueFacility
    alreadyExist.availableSport =  req.body.availableSport

  try{
     await alreadyExist.save()
     res.status(200).send({
      status : true,
      message: "Successfully submitted",
  });
  }
  catch {
      res.status(400).send({
          status: "something went wrong",
      });
  }




})


module.exports = router;