const express = require("express");
const router = express();
const HostActivity = require("../models/u_hostActivity");
const BookActivity = require("../models/u_BookActivity");
const Booking = require("../models/booking");
const {Slots ,detailedSlots} = require("../models/slots");
const auth = require('../middlewares/auth').u_auth
const moment = require("moment")
const Invites = require('../models/invites')
const mongoose = require('mongoose');
const User = require('../models/u_user')
const {sendNotification } = require('../middlewares/notificationService')
const {sendBusinessNotification } = require('../middlewares/businessNotification')

const {TransactionId}  = require("../models/wallet");
const B_User = require('../models/user')
router.post('/create' , auth , async (req,res) => {
    const bookingId = await TransactionId.findById('62482a61043dc98342a99f1b')
 
    const hostActivity = new HostActivity({
        activityName : req.body.activityName,
        organizer : req.user.id._id,
        selectedSport : req.body.selectedSport,
        location : req.body.location,
       venueFacility :  req.body.venueFacility,
       additionalInfo :  req.body.additionalInfo,
       startTime : req.body.startTime,
       endTime :  req.body.endTime,
       selectedDate : req.body.selectedDate,
       skills : req.body.skills,
       ageGroup : req.body.ageGroup,
       total : req.body.total,
       confirmed : req.body.confirmed,
       gender : req.body.gender,
        isPublic : req.body.isPublic,
        facilityOwner : req.body.facilityOwner,
        paymentType : req.body.paymentType,
        price : req.body.price,
        pitchDetail : req.body.pitchDetail,
        isBooking : req.body.isBooking,
        bookingId : bookingId.trasactionId,

    })
   const response = await hostActivity.save()
   

   if (req.body.invitedUsers.length > 0){
       const invites = new Invites ({
        invitedBy : req.user.id._id,
        InvitedList : req.body.invitedUsers,
        activity : response._id,
        eventDate : req.body.selectedDate,

       })
 
       await invites.save()
       const message = `You have been invited by ${req.user.id.firstName} to join a Game!`
       const title = 'Invitation'

       req.body.invitedUsers.forEach( async (element) => {
           const invitationUsers = await  User.findById(element)
           const actions = {
            navigate : 'myInvites'
        }

           sendNotification(invitationUsers.fcmToken , title , message , actions)
       });
   }
   const addPOints = await User.findById(req.user.id._id)
   addPOints.points = addPOints.points + 10
   addPOints.save()

    res.status(200).send({
        status : true,
        facilityId : response._id,
        activityId : response._id,
        message : "Succesffuly create an Activity"
    })

    
    bookingId.trasactionId = bookingId.trasactionId + 1
    bookingId.save()
})

router.post('/delete' , auth , async (req,res) => {

  const removeInvites =  await Invites.findOneAndDelete({activity : req.body.activityId})
    

    const isBooking  = await Booking.findOne({
        activityId : req.body.activityId
    })
    if (isBooking) {

        let businessOwner = await B_User.findById(isBooking.user)
        let fcmToken = businessOwner.fcmToken
        const message = `${req.user.id.firstName} has cancelled your Booking`
        const title = 'Booking Cancelled'
        sendBusinessNotification(fcmToken, title , message)

        const detail = await detailedSlots.findById(isBooking.detailSlotId)
        const filter = await detail.detail.find(item => item._id  == String(isBooking.timeSlot._id))
        filter.booked = false
      await detail.save() 
     const hostActivity = await HostActivity.findByIdAndDelete(req.body.activityId)
     const deleteBooking = await Booking.findOneAndDelete({
        activityId : req.body.activityId
     })
}else {
     const hostActivity = await HostActivity.findByIdAndDelete(req.body.activityId)
}

    res.status(200).send({
        status : true,
        message : "Succesffuly deleted"
    })
})


router.get('/myGames' , auth , async (req,res) => {
   try{
    var startdate = moment();
    startdate = startdate.subtract(1, "days");
      
    const myGames = await HostActivity.find({$or : [
        {
            organizer : req.user.id._id
        },
        {
            playerJoined : req.user.id._id
        }, 
        
    ] ,
    selectedDate : {
        $gte: startdate, 
    },

}).populate({
    path : 'organizer selectedSport facilityOwner',

}).populate({
    path : "playerJoined",
    populate : {
        path : 'sportsInterest'
    }
}) .select('-__V -password')
  
 
  
    res.status(200).send({
        status : true,
        myGames : myGames.reverse()
    })
   }
   catch(ex) {

   }
})

router.get('/myPastGames' , auth , async (req,res) => {
  try {
 
      
    const myGames = await HostActivity.find({$or : [
        {
            organizer : req.user.id._id
        },
        {
            playerJoined : req.user.id._id
        }, 
    ],
    selectedDate : {
        $lt: moment(), 
    },

}).populate({
    path : 'organizer selectedSport facilityOwner',

}).populate({
    path : "playerJoined",
    populate : {
        path : 'sportsInterest'
    }
}) .select('-__V -password')

  
    res.status(200).send({
        status : true,
        myGames : myGames.reverse()
    })
  }
  catch (ex){
    console.log(ex)
  }
})


router.get('/playNow' , auth , async (req,res) => {
    try{
        const myGames = await HostActivity.find({
            organizer :{ 
                $ne: req.user.id._id ,
            },
            selectedDate : {
                $gte: moment(), 
            },
            isPublic : true
        }).populate({
                path : 'organizer',
                populate : {
                    path : 'sportsInterest'
                }
            })
            .populate({
                path : 'selectedSport'
            })
            .populate({
                path : 'playerJoined',
                populate : {
                    path : 'sportsInterest'
                }
            })
             .select('-__V -password')
        
        const bookActivities = await BookActivity.find({          
                organizer : { 
                    $ne: req.user.id._id ,
                },
                isPublic : true
        }).populate('organizer selectedSport playerJoined').select('-__V -password')

        if (bookActivities.length > 0) {
            bookActivities.forEach(element => {
                myGames.push(element)
            });
        }

        myGames.push()
        res.status(200).send({
            status : true,
            myGames : myGames.reverse()
        })
    }
    catch (ex){
        console.log(ex)
    }
  
})

router.post('/joinGame' , auth , async (req , res) => { 
    try {
            const games = await HostActivity.findById(req.body.gameId)
            const alreadyJoined = games.playerJoined.find(item => item == req.body.gameId)
            if(alreadyJoined){
                return res.status(200).send({
                    status : false ,
                    message : "Already Joined"
                })
            }
            if (games.total == games.confirmed){
                return res.status(200).send({
                    status : false ,
                    message : "Players are full"
                })
            }
            games.playerJoined.push(req.user.id._id)
            games.confirmed = games.confirmed + 1

            await games.save()

            res.status(200).send({
                status : true ,
                message : "Successfully Joined"
            })

            const organizer = await User.findById(games.organizer)
            const message = `${req.user.id.firstName} has joined your Game!`
            const title = 'Player Joined'
            sendNotification(organizer.fcmToken , title , message)


            const addPOints = await User.findById(req.user.id._id)
            addPOints.points = addPOints.points + 5
            addPOints.wallet = addPOints.wallet + games.price
            addPOints.save()        

    }
    catch(ex) {
        console.log(ex)
    }
})

router.post('/joinBookingGame' , auth , async (req , res) => { 
    try {
            const games = await BookActivity.findById(req.body.gameId)
            const alreadyJoined = games.playerJoined.find(item => item == req.body.gameId)
            if(alreadyJoined){
                return res.status(200).send({
                    status : false ,
                    message : "Already Joined"
                })
            }
            if (games.total == games.confirmed){
                return res.status(200).send({
                    status : false ,
                    message : "Players are full"
                })
            }
            games.playerJoined.push(req.user.id._id)
            games.confirmed = games.confirmed + 1
            await games.save()
            
            res.status(200).send({
                status : true ,
                message : "Successfully Joined"
            })
    }
    catch(ex) {
        console.log(ex)
    }
})

router.get('/getInvitedList' , auth , async (req , res )=> { 
try {
    const invitedGames = await Invites.find({
        InvitedList : mongoose.Types.ObjectId(req.user.id._id),
        eventDate : {
            $gte: moment(), 
        },
    }).populate({
        path : 'activity',
        populate : {
            path : 'organizer selectedSport playerJoined',
         
        },
    })
    res.status(200).send({
        gamesList : invitedGames
    })
}
catch {

}
})

router.post('/leaveGame' , auth , async (req , res) => { 
    try {
            const games = await HostActivity.findById(req.body.gameId)
            var eventDay = moment.utc(games.selectedDate).format('MM-DD-YYYY')
            var eventStartTime = moment.utc(games.startTime , 'hh:mm A').format('hh:mm A')
            var eventTime = moment(`${eventDay} ${eventStartTime}` , 'MM-DD-YYYY hh:mm A')
            var currentTime = moment(new Date())
            console.log(currentTime.format('hh:mm A'))
            console.log(eventTime.format('hh:mm A'))
            var duration = moment.duration(eventTime.diff(currentTime));
            
            if (duration < 0) { 
              return  res.status(200).send({
                    status : false ,
                    message : "You Can not leave this game now"
                })
            }

            if (duration > 12) { 
             const leave =  games.playerJoined.filter(item => item != req.user.id._id)
            games.confirmed = games.confirmed - 1
            games.playerJoined = leave
            await games.save()
            res.status(200).send({
                status : true ,
                message : "Successfully Cancelled"
            })
            if (games.isBooking) {
                Booking.findOneAndDelete({
                    activityId : games._id
                })
            }
            const organizer = await User.findById(games.organizer)
            const message = `${req.user.id.firstName} has left your Game!`
            const title = 'Player Left'
            sendNotification(organizer.fcmToken , title , message)

            const addPOints = await User.findById(req.user.id._id)
            addPOints.points = addPOints.points - 5
            addPOints.wallet = addPOints.wallet - games.price
            addPOints.save()  
            } else { 
                res.status(200).send({
                    status : false ,
                    message : "You Can not leave this game now"
                })
            }



    }
    catch(ex) {
        console.log(ex)
    }
})


router.post('/leaveBookingGame' , auth , async (req , res) => { 
    try {
            const games = await BookActivity.findById(req.body.gameId)
            const leave =  games.playerJoined.filter(item => item != req.user.id._id)
            games.confirmed = games.confirmed - 1
            games.playerJoined = leave
            await games.save()
            res.status(200).send({
                status : true ,
                message : "Successfully Cancelled"
            })
    }
    catch(ex) {
        console.log(ex)
    }
})









module.exports = router;