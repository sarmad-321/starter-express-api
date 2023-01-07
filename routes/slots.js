const express = require("express");
const jwt = require("jsonwebtoken");
const router = express();
const Joi = require("joi");
const {Slots ,detailedSlots} = require("../models/slots");
const Moment = require('moment')
const {extendMoment} = require('moment-range') 

const moment = extendMoment(Moment);
const auth =  require('../middlewares/auth') 


router.post('/add' , auth, async (req, res) => { 
    try
    {
        let error = false;

        //Validation ==> 
        var start = moment(req.body.date.from , 'MM-DD-YYYY' );
        var end = moment(req.body.date.to ,  'MM-DD-YYYY');
       var totalDays = Math.abs( moment.duration(start.diff(end)).asDays())
        let result;
    
       for (let index = 0; index <= totalDays; index++) {


        const date = moment(start); // Thursday Feb 2015
        const dow = date.day();
        const newDate = moment(date.add(index,'days').format('MM-DD-YYYY'))
        const bool = req.body.days.find(item => {
            if(item === newDate.day()){
                return true
            }
        })
        if(bool >= 0) {
 
            const recentSlot = await detailedSlots.find({
                date : moment(newDate).format('MM-DD-YYYY'),
                facility : req.body.facility,
                pitch : req.body.pitch
            })
            if (recentSlot[0]){

                for (let i = 0; index < recentSlot[0].detail.length; i++) {
                    if (error) {
                        break
                    }
                    const item = recentSlot[0].detail[i];
                    
                const slotDetail = req.body.slot.map(u => Object.assign({}, u ));
                slotDetail.map((item) => {
                    var from = moment(item.from , 'hh:mm a')
                    var fromBefore = moment('11:59 PM' , 'hh:mm A')
                    var fromAfter = moment('12:00 PM' , 'hh:mm A')
                    item.from = moment.utc(`${moment(newDate).format('MM-DD-YYYY')} ${item.from}` , 'MM-DD-YYYY hh:mm A')
                    var toAfter = moment('12:00 AM' , 'hh:mm A')
                    var toBefore = moment('11:59 AM', 'hh:mm A')
                    var to = moment(item.to , 'hh:mm a')
                    if (from.isBefore(fromBefore) && from.isSameOrAfter(fromAfter) 
                    &&   to.isSameOrAfter(toAfter) && to.isBefore(toBefore)
                    ){
                        item.to = moment.utc(`${moment(date.add(1,'days')).format('MM-DD-YYYY')} ${item.to}` , 'MM-DD-YYYY hh:mm a')
                    }else{
                        item.to = moment.utc(`${moment(newDate).format('MM-DD-YYYY')} ${item.to}` , 'MM-DD-YYYY hh:mm a')
                    }
                })

                for (let k = 0; k < slotDetail.length; k++) {
                    const element = slotDetail[k];
                      const range1 = moment.range(item.from , item.to)
                    const range2 = moment.range(element.from , element.to)
                    const overlap = range1.overlaps(range2)
                    if(overlap){
                        error = true
                        res.status(200).send({
                        status : false, 
                        message : "timing are conflicting with other slots",
                        conflictedDate : moment(newDate).format('MMM-DD-YYYY'),
                        conflictedTiming : {
                            from : moment(element.from).format('hh:mm a'),
                            to : moment(element.to).format('hh:mm a')
                        }   
                    })
                    break
                    }else {
                        console.log("No Conflicts")
                    }
                }
                }
            }
            }
       }
       if(!error) {
        let request = new Slots(
            {
            name  : req.body.name ,
            user : req.user.id._id,
            sport  : req.body.sport,
            facility : req.body.facility,
            pitch : req.body.pitch,
            date : req.body.date,
            days  : req.body.days,
            slot : req.body.slot
        }
        )
        const response  =  await request.save()
        var start = moment(req.body.date.from , 'MM-DD-YYYY' );
        var end = moment(req.body.date.to ,  'MM-DD-YYYY');
       var totalDays = Math.abs( moment.duration(start.diff(end)).asDays())
            
       for (let index = 0; index <= totalDays; index++) { 
        const date = moment(start); // Thursday Feb 2015
        const dow = date.day();
        const newDate = moment(date.add(index,'days').format('MM-DD-YYYY'))
        const bool = req.body.days.find(item => {
            if(item === newDate.day()){
                return true
            }
        })
        if(bool >= 0) {

            const newSlot = req.body.slot.map(u => Object.assign({}, u ));
            newSlot.map((item) => {
                var from = moment(item.from , 'hh:mm A')
                var fromBefore = moment('11:59 PM' , 'hh:mm A')
                var fromAfter = moment('12:00 PM' , 'hh:mm A')
                item.from = moment.utc(`${moment(newDate).format('MM-DD-YYYY')} ${item.from}` , 'MM-DD-YYYY hh:mm A')
                var toAfter = moment('12:00 AM' , 'hh:mm A')
                var toBefore = moment('11:59 AM', 'hh:mm A')
                var to = moment(item.to , 'hh:mm A')
                if (from.isBefore(fromBefore) && from.isSameOrAfter(fromAfter) 
                 &&   to.isSameOrAfter(toAfter) && to.isBefore(toBefore)
                ){
                    item.to = moment.utc(`${moment(date.add(1,'days')).format('MM-DD-YYYY')} ${item.to}` , 'MM-DD-YYYY hh:mm A')
                }else{
                    item.to = moment.utc(`${moment(newDate).format('MM-DD-YYYY')} ${item.to}` , 'MM-DD-YYYY hh:mm A')
                }
            })
          
                let slotDetail = new detailedSlots({
                    slot : response._id,
                    date : moment(newDate).format('MM-DD-YYYY'),
                    user : req.user.id._id,
                    sport  : req.body.sport,
                    facility : req.body.facility,
                    pitch : req.body.pitch,
                    detail : newSlot,
                })
                    await slotDetail.save()
             
            }
       }
     return  res.status(200).send({
        status :true,
        message : "Slots have been created sucessfully"
    })
       }
    }
    catch(ex)
    {
        console.log(ex)
        res.status(200).send({
            status : true,
            message: "something went wrong please try again"
        });
    }
})
router.post('/unBlock' , auth , async (req , res) => {

    let slotDetail = await detailedSlots.findOne({
        _id : req.body.detailSlotId,
    })
    if(!slotDetail) { 
        return res.status(200).send({
            status : false , 
            message : "No slots Available to this request"
        })
    }
    let time = await slotDetail.detail
    .find(item => item._id == req.body.slotId )
    if (time.booked) {
        return res.status(200).send({
            status : false, 
            message : "Already Reserved"
        })
    }
    time.blocked = false
    try{

     let result = await slotDetail.save()
        res.status(200).send({
            status : true ,
            message : "Slot has been successfully blocked"
        })

    }
    catch(ex) {
            console.log(ex)
    }
})

router.post('/editIndividual' , auth , async (req , res) => {

    let slotDetail = await detailedSlots.findOne({
        _id : req.body.detailSlotId,
    })
    if(!slotDetail) { 
        return res.status(200).send({
            status : false , 
            message : "No slots Available to this request"
        })
    }
    let time = await slotDetail.detail
    .find(item => item._id == req.body.slotId )
    if (time.booked) {
        return res.status(200).send({
            status : false, 
            message : "Already Reserved"
        })
    }
    time.price = req.body.price
    try{

     let result = await slotDetail.save()
        res.status(200).send({
            status : true ,
            message : "Slot has been successfully blocked"
        })

    }
    catch(ex) {
            console.log(ex)
    }
})


router.post('/block' , auth , async (req , res) => {

    let slotDetail = await detailedSlots.findOne({
        _id : req.body.detailSlotId,
    })
    if(!slotDetail) { 
        return res.status(200).send({
            status : false , 
            message : "No slots Available to this request"
        })
    }
    let time = await slotDetail.detail
    .find(item => item._id == req.body.slotId )
    if (time.booked) {
        return res.status(200).send({
            status : false, 
            message : "Already Reserved"
        })
    }
    time.blocked = true
    try{

     let result = await slotDetail.save()
        res.status(200).send({
            status : true ,
            message : "Slot has been successfully blocked"
        })

    }
    catch(ex) {
            console.log(ex)
    }
})

router.get('/' , auth , async (req , res)=> {
    try
    {
        let slots = await Slots.find({
            user : req.user.id._id
        })
        .populate('sport pitch')
        .select('-__v')
        res.status(200).send({
            status : true ,
            slots  : slots
        })
    }
    catch
    {
        res.status(400).send({
            status : false,
            message : "something went wrong"
        })
    }

})

router.post('/getByDate' , auth , async (req, res) =>{
    const slots  = await detailedSlots.find({
        user : req.user.id._id,
        date : req.body.date
    }).populate({
        path : 'slot',
        populate : {
            path : 'sport pitch facility',
            
        }
    } )
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

    router.post('/edit',  auth , async (req,res)=> {

            const slots = await Slots.findById(req.body._id)
            slots.slot = req.body.slot
            slots.name = req.body.name
            await slots.save()

            const detailSlots = await detailedSlots.find({
                slot : req.body._id
            })
            let arrayOfSlots = req.body.slot;
            for (let index = 0; index < detailSlots.length; index++) {
                const element = detailSlots[index];

                element.detail.map((item , count)=> {
                    if (item.booked == false){
                        item.price = arrayOfSlots[count].price

                    }
                })

                element.save()
                
            }
            res.status(200).send({
                status : true
            })           
    })


module.exports = router
