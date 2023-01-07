const express = require("express");
const router = express();
const Offers = require("../models/offer");
const Facility = require ('../models/facility')
const auth = require('../middlewares/auth').u_auth

router.post('/createOffer' , async(req , res)=> { 
        
    const createDiscount = await Facility.findById(req.body.facilityId)
    createDiscount.discount = req.body.discount
    await createDiscount.save()

    const alreadyExist = await Offers.findOne({
        facilityId : req.body.facilityId
    })
    if (alreadyExist){ 
        alreadyExist.discount = req.body.discount
       await alreadyExist.save()
       return  res.status(200).send({
        status : true ,
        message : "Offer has been created succesffully"
    })
    }

    const createOffer = new Offers({
        facilityId : req.body.facilityId,
        discount : req.body.discount  
    })

    await createOffer.save()

    res.status(200).send({
        status : true ,
        message : "Offer has been created succesffully"
    })
})

    router.get('/getAllOffers' , async (req, res) => { 
        const offers = await Offers.find().populate({
            path : 'facilityId',
            populate : {
                path : 'availableSport'
            }
        })

        return res.status(200).send({
            status : true , 
            offers : offers
        })
    })



module.exports = router;
