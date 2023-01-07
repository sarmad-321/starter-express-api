const express = require("express");
const router = express();
const BookActivity = require("../models/u_BookActivity");
const auth = require('../middlewares/auth').u_auth
const moment = require("moment")
const Invites = require('../models/invites')
const mongoose = require('mongoose');

router.post('/create' , auth , async (req,res) => {
    const hostActivity = new BookActivity({
          activityName : req.body.activityName,
          organizer : req.user.id._id,
          bookedBy : req.user.id._id,
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
          paymentType : req.body.paymentType,
          price : req.body.price,
          pitchDetail : req.body.pitchDetail,
    })
   const response = await hostActivity.save()

   if (req.body.invitedUsers.length > 0){
       const invites = new Invites ({
        invitedBy : req.user.id._id,
        InvitedList : req.body.invitedUsers,
        activity : response._id,
       })

       await invites.save()
   }


    res.status(200).send({
        status : true,
        facilityId : response._id,
        message : "Succesffuly create an Activity"
    })
})

module.exports = router;
