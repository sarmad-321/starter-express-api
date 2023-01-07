const express = require("express");
const router = express();
const Terms = require("../models/termsConditions");
const Policy = require("../models/privacyPolicy")

router.post('/terms' , async(req , res)=> {
       try {
        let terms = await Terms.findOne({
            businessApp : req.body.businessApp
        })
        terms.text = req.body.text
    
        terms.save()
          res.status(200).send({
              status : true ,
              message : "Terms has been added"
          })
       } 
       catch (ex) {
        console.log(ex)
       }

})


router.post('/privacy' , async(req , res)=> {
    try {
        let privacy = await Policy.findOne({
            businessApp : req.body.businessApp
        })
        privacy.text = req.body.text
    
        privacy.save()
          res.status(200).send({
              status : true ,
              message : "Policy has been added"
          })
    } 
    catch (ex) {
        console.log(ex)

    }

})


router.get('/terms/user', async(req , res) => {
    try {
        let train = await Terms.findOne({
            businessApp : false
        })
        res.status(200).send({
            terms : train
        })
    } 
    catch (ex) {
        console.log(ex)

    }

})


router.get('/terms/business', async(req , res) => {
    try {
        let train = await Terms.findOne({
            businessApp : true
        })
            res.status(200).send({
             terms : train
        })
    } 
    catch (ex) {
        console.log(ex)

    }


})



router.get('/policy/user', async(req , res) => {
    try {
        let train = await Policy.findOne({
            businessApp : false
        })
        res.status(200).send({
            policy : train
        })
    } 
    catch (ex) {

        console.log(ex)
    }


})


router.get('/policy/business', async(req , res) => {
    try {
        let train = await Policy.findOne({
            businessApp : true
        })
            res.status(200).send({
             policy : train
        })
    } 
    catch (ex) {
        console.log(ex)

    }
 
})

module.exports = router;