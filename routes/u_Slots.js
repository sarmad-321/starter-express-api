const express = require("express");
const jwt = require("jsonwebtoken");
const router = express();
const Joi = require("joi");
const {Slots ,detailedSlots} = require("../models/slots");
const Moment = require('moment')
const {extendMoment} = require('moment-range') 

const moment = extendMoment(Moment);
const auth =  require('../middlewares/auth').u_auth 

router.post('/getByDate' , auth , async (req, res) =>{
    const slots  = await detailedSlots.find({
        facility : req.body.facility,
        date : req.body.date
    }).populate({
        path : 'slot',
        populate : {
            path : 'sport pitch facility',
            
        }
    })
    console.log(slots)

    if (slots.length >= 1){
        res.status(200).send({
            status  :true , 
            slots  : slots
        })
    }else {
        res.status(200).send({
            status  :false , 
            slots  : "No slots available to this date"
        })
    }
})


module.exports = router
