const express = require("express");
const router = express();
const auth = require ('../middlewares/auth')
const Pitch = require("../models/pitch")
const {detailedSlots , Slots} = require('../models/slots')

router.post('/add' , auth ,async(req , res)=> { 
        
    let pitch = new Pitch({
        name  : req.body.name ,
        user  : req.user.id._id,
        sport  : req.body.sport,
        facility :req.body.facility,
        maxPlayers : req.body.maxPlayers,
    })

    try{
        await pitch.save()
        res.status(200).send({
         status : true,
         message: "Pitch successfully submitted",
     });
     }
     catch {
         res.status(400).send({
             status: "something went wrong",
         });
     }
})

router.get('/get' ,auth , async(req, res)=> { 
    try {
        let data = await Pitch.find({
            user : req.user.id._id
        })
            .populate("sport facility", )
            .select(" -__v");
        res.status(200).send({
            status : true ,
            pitch : data
        });
    } catch {
        res.status(400).send({
            status: "something went wrong",
        });
    }
})

router.post('/edit' , async (req , res)=> {
    try{
        let pitch = await Pitch.findById(req.body.id)
        pitch.maxPlayers = req.body.maxPlayers
        pitch.name = req.body.name
        await pitch.save()
        res.status(200).send({
            status : true ,
            message : "Pitch edit successfully"
        })
    }   
    catch {
        res.status(400).send({
            status : true ,
            message : "Something went wrong"
        })
    }
})

router.post('/del' , async (req , res) => {
    try{
        let alreadyInUse = await Slots.findOne({pitch : req.body.id})
        if (alreadyInUse) {
           return res.status(200).send({
               status : false , 
               message : "Can not delete this pitch/court. Its already in use"
           }) 
        }

        let data = await Pitch.findByIdAndDelete(req.body.id)
        res.status(200).send({
            status : true , 
            message : "Pitch has been successfully removed"
        })
    }
    catch { 
        res.status(400).send({
            status: "something went wrong",
        });
    }
})
module.exports = router