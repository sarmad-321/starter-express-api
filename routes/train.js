const express = require("express");
const router = express();
const Train = require("../models/train");
const fs = require('fs')
const moment = require('moment')

router.post('/' , async(req , res)=> {
    
    let screenshotUrl=""
    if (req.body.coverPhoto){ 
        const folderPath = `./images/train/`
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath)        
        }
        const date = moment().unix()
  
                var base64Data = req.body.coverPhoto.image.replace("data:image/png;base64,", "");
                fs.writeFile(`${folderPath}/${date}.png`, base64Data, 'base64' , function(err) {
                    console.log(err);
                  })    
                   screenshotUrl = `/train/${date}.png` 
    }
    let train = new Train({
        name  : req.body.name , 
        description : req.body.description,   
        location : req.body.location,
        facebook : req.body.facebook,
        individual : req.body.individual,
        whatsApp : req.body.whatsApp,
        google : req.body.google,
        website : req.body.website, 
        coverPhoto : screenshotUrl
    })
      train.save()
      res.status(200).send({
          status : true ,
          message : "Successfully train has been added"
      })
})

router.get('/', async(req , res) => {
    let train = await Train.find({
        individual : false
    })
    res.status(200).send({
        train : train
    })
} )

router.post('/delete' , async(req , res)=> { 
    let train = await Train.findByIdAndDelete(req.body.train)
    res.status(200).send({
        message : "Deleted Successfully"
    })
})

router.get('/individual' , async (req , res)=> { 
    let train = await Train.find({
        individual : true
    })
    res.status(200).send({
        train : train
    })
})


module.exports = router;