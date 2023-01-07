const express = require("express");
const router = express();
const VenueFacilities = require("../models/venueFacilities");


router.post('/' , async(req , res)=> {
        
    let venueFacilities = new VenueFacilities({
            name : req.body.name,
            logo : `/venueFacilities/${req.body.name.toLowerCase()}.png`
        })
        venueFacilities.save()
        
        
})

router.get('/', async(req , res) => {
    let venueFacilities = await VenueFacilities.find()
    res.status(200).send({
        venueFacilities : venueFacilities
    })
} )


module.exports = router;