const express = require("express");
const router = express();
const User = require('../models/u_user')
const auth = require('../middlewares/auth')
const Booking = require("../models/booking");
const {detailedSlots} = require("../models/slots");
const moment = require('moment')


router.get('/myReports' , auth , async (req , res) => {

    let booking = await Booking.find({
        user : req.user.id._id
    })
   const totalBooking = booking.length

   let totalEarnings = 0
   booking.map((item)=> { 
       totalEarnings = totalEarnings + parseInt(item.timeSlot.price)
   })
   let booked = 0
   let unBooked = 0

   const slots = await detailedSlots.find({user : req.user.id._id })
   slots.map((item)=> { 
       item.detail.map((element) => {
           if (element.booked) { 
               booked = booked + 1 
           }else { 
               unBooked = unBooked + 1 
           }
       })
   })
    let report =  {
        totalBooking :  booked,
        totalEarnings : totalEarnings, 
        unBooked : unBooked
    }
    res.status(200).send({
        status :  true ,
        report : report 
    })
})  

router.post('/reportByDate' , auth , async (req,res)=> { 

    let booking

    if(req.body.startDate != 'Start Date' && req.body.endDate != 'End Date'){
        booking = await Booking.find({
            createdAt : {
                $gte: moment(req.body.startDate ,'MM-DD-YYYY'), 
                $lt: moment(req.body.endDate , 'MM-DD-YYYY')
            },
            user : req.user.id._id,
            
        })
    }else { 
        booking = await Booking.find({
            user : req.user.id._id,
        })
    }

    const totalBooking = booking.length

    let totalEarnings = 0
    // booking.map((item)=> { 
    //     totalEarnings = totalEarnings + parseInt(item.timeSlot.price)
    // })
    let booked = 0
    let unBooked = 0
    let slots ;

    if (req.body.sport && req.body.facility){

        slots = await detailedSlots.find({
            user : req.user.id._id,
            sport : req.body.sport,
            facility : req.body.facility
        })
    }

    if (req.body.sport && !req.body.facility ){

        slots = await detailedSlots.find({
            user : req.user.id._id,
            sport : req.body.sport,
        })
    }

    if (req.body.facility && !req.body.sport){

        slots = await detailedSlots.find({
            user : req.user.id._id,
            facility : req.body.facility
        })
    }

        if (!req.body.facility && !req.body.sport){

        slots = await detailedSlots.find({
            user : req.user.id._id,
        })
    }
    
   
 
    if(req.body.startDate != 'Start Date' && req.body.endDate != 'End Date'){
        slots.map((item)=> {
        let slotDate = moment.utc(item.date)
       if ( slotDate.isSameOrAfter(req.body.startDate) && slotDate.isSameOrBefore(req.body.endDate)){
          item.detail.map((element) => {
              unBooked = unBooked +1
            if (element.booked) { 
                booked = booked + 1 
                totalEarnings = totalEarnings + parseInt(element.price)
            }
        })
       }
    })
}else {
    slots.map((item)=> { 
        item.detail.map((element) => {
            if (element.booked) { 
                totalEarnings = totalEarnings + parseInt(element.price) ,
                booked = booked + 1 
            }else { 
                unBooked = unBooked + 1 
            }
        })
    })
}



     let report =  {
         totalBooking :  booked,
         totalEarnings : totalEarnings, 
         unBooked : unBooked
     }

  
     res.status(200).send({
         status :  true ,
         report : report 
     })
    })

    router.post('/reportBySports' , auth , async (req,res)=> { 

        let booking = await Booking.find({
            user : req.user.id._id,
            sport :  req.body.sport
        })
       const totalBooking = booking.length
       console.log(booking.length)
    
       let totalEarnings = 0
    //    booking.map((item)=> { 
    //        totalEarnings = totalEarnings + parseInt(item.timeSlot.price)
    //    })
       let booked = 0
       let unBooked = 0
    
       const slots = await detailedSlots.find({
           user : req.user.id._id,
           sport : req.body.sport
        
        })
       slots.map((item)=> { 
           item.detail.map((element) => {
               if (element.booked) { 
                   totalEarnings = totalEarnings + parseInt(element.price) ,
                   booked = booked + 1 
               }else { 
                   unBooked = unBooked + 1 
               }
           })
       })
        let report =  {
            totalBooking :  booked,
            totalEarnings : totalEarnings, 
            unBooked : unBooked
        }
        res.status(200).send({
            status :  true ,
            report : report 
        })

    })

    router.post('/reportByFacility' , auth , async (req,res)=> { 
 
       let totalEarnings = 0
    //    booking.map((item)=> { 
    //        totalEarnings = totalEarnings + parseInt(item.timeSlot.price)
    //    })
       let booked = 0
       let unBooked = 0
    
       const slots = await detailedSlots.find({
           user : req.user.id._id,
           facility : req.body.facility
        
        })
       slots.map((item)=> { 
           item.detail.map((element) => {
               if (element.booked) { 
                   totalEarnings = totalEarnings + parseInt(element.price) ,
                   booked = booked + 1 
               }else { 
                   unBooked = unBooked + 1 
               }
           })
       })
        let report =  {
            totalBooking :  booked,
            totalEarnings : totalEarnings, 
            unBooked : unBooked
        }
        res.status(200).send({
            status :  true ,
            report : report 
        })
    })

    router.post('/reportByFacilitySport' , auth , async (req,res)=> { 
 
        let totalEarnings = 0
     //    booking.map((item)=> { 
     //        totalEarnings = totalEarnings + parseInt(item.timeSlot.price)
     //    })
        let booked = 0
        let unBooked = 0
     
        const slots = await detailedSlots.find({
            user : req.user.id._id,
            sport : req.body.sport,
            facility : req.body.facility
         
         })
        slots.map((item)=> { 
            item.detail.map((element) => {
                if (element.booked) { 
                    totalEarnings = totalEarnings + parseInt(element.price) ,
                    booked = booked + 1 
                }else { 
                    unBooked = unBooked + 1 
                }
            })
        })
         let report =  {
             totalBooking :  booked,
             totalEarnings : totalEarnings, 
             unBooked : unBooked
         }
         res.status(200).send({
             status :  true ,
             report : report 
         })
     })

module.exports = router;
