const express = require("express");
const router = express();
const Sports = require("../models/sports");


router.post('/' , async(req , res)=> {
        
    let sport = new Sports({
            name : req.body.name
        })
        sport.save()
        
        
})

router.get('/', async(req , res) => {
    let sports = await Sports.find()
    res.status(200).send({
        sports : sports
    })
} )


module.exports = router;