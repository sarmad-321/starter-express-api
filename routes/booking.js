const express = require("express");
const jwt = require("jsonwebtoken");
const router = express();
const moment = require('moment')
const auth =  require('../middlewares/auth').u_auth ;
const businessAuth = require('../middlewares/auth')
const Booking = require("../models/booking");
const {Slots ,detailedSlots} = require("../models/slots");
const {TransactionId}  = require("../models/wallet");
const {sendBusinessNotification} = require('../middlewares/businessNotification')
const Users = require("../models/user");
const HostActivity = require('../models/u_hostActivity')

router.post('/create' , auth , async (req , res) => {

    let slotDetail = await detailedSlots.findOne({
        _id : req.body.detailSlotId,
    })
    if(!slotDetail) { 
        return res.status(200).send({
            status : false , 
            message : "No slots Available to this request"
        })
    }
    let time = await slotDetail.detail.find(item => item._id == req.body.slotId )
    if (time.booked) {
        const removeActivity = await HostActivity.findByIdAndDelete(req.body.activityId)
        return res.status(200).send({
            status : false, 
            message : "Already Reserved"
        })
    }

    if (time.blocked){
        const removeActivity = await HostActivity.findByIdAndDelete(req.body.activityId)
        return res.status(200).send({
            status : false, 
            message : "Your booking couldn’t be completed as the slot is on hold by the facility"
        })
    }
    
   
    try{   
    time.booked = true     
    let booking = new Booking({
        user : req.body.user,
        bookedBy  : req.user.id._id,
        slot  : req.body.slot,
        detailSlotId : req.body.detailSlotId,
        date : req.body.date,
        timeSlot : time,
        isFacility : req.body.isFacility,
        activityId : req.body.activityId
    })
      let result = await slotDetail.save()
        await booking.save()
        let businessOwner = await Users.findById(req.body.user)
        let fcmToken = businessOwner.fcmToken
        const message = `${req.user.id.firstName} has Booked your Facility`
        const title = 'Facility Booked'
        sendBusinessNotification(fcmToken, title , message)
        
        res.status(200).send({
            status : true ,
            message : "Booking has been saved successfully"
        })

    }
    catch(ex) {
            console.log(ex)
    }
})

router.get('/' , businessAuth , async (req, res) => { 
    try
    {
        let booking = await Booking.find({
            user : req.user.id._id
        })
        .populate({
            path : "slot",
            select : "sport pitch facility",
            populate : {
                path : "sport facility pitch",
                select : "name location logo "
            }
        },
       
        ).populate({
            path : "bookedBy",
        }).populate({
            path : "activityId"
        })
        .select('-__v')
        res.status(200).send({
            status : true ,
            booking :  booking.reverse()
        })
    }
    catch (ex)
    {
            console.log(ex)
    }
})
router.get('/getAllBooking'  , async (req, res) => { 
    try
    {
        let booking = await Booking.find()
        .select('-__v')
        res.status(200).send({
            status : true ,
            booking :  booking
        })
    }
    catch (ex)
    {
            console.log(ex)
    }
})

module.exports = router;