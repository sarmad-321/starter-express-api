const express = require("express");
const router = express();
const auth = require('../middlewares/auth').u_auth
const b_auth = require('../middlewares/auth')
const Messages = require("../models/messages");
const Conversation = require ('../models/conversation')
const User = require ('../models/u_user')
const Business_User = require ('../models/user')
const {sendNotification} = require('../middlewares/notificationService')
const {sendBusinessNotification} = require('../middlewares/businessNotification')

router.post('/' , auth , b_auth, async (req,res) => {
    const message = new Messages({
        convesationId: req.body.convesationId,
         sender: req.body.sender, 
          text: req.body.text
    })
    try{
          const save =  await message.save()
          res.status(200).send(save);
          
          const convoUpdate = await Conversation.findById(req.body.convesationId)
          convoUpdate.lastMessage = req.body.text
          convoUpdate.isActive = true
          convoUpdate.save()

          const reciever = await User.findById(req.body.reciever)
            if (reciever) {
                const body = `${req.body.text}`
                const title = `${req.user.id.firstName}`
                const actions = {
                    navigate : 'messages',
                    convoId : JSON.stringify(convoUpdate) ,
                     receiver : String(req.body.reciever) ,
                    friendName : `${reciever.firstName} ${reciever.lastName}`
                }
// convoId : response.data.conversation , receiver : item._id , friendName : `${item.firstName} ${item.lastName}
                sendNotification(reciever.fcmToken , title , body , actions)
            }
            const recieverBusiness = await Business_User.findById(req.body.reciever)
            if (recieverBusiness) {
                const body = `${req.body.text}`
                const title = `${req.user.id.firstName}`
                const actions = {
                    navigate : 'messages',
                    convoId : JSON.stringify(convoUpdate) ,
                     receiver : String(req.body.reciever) ,
                    friendName : `${req.user.id.firstName} ${req.user.id.lastName}`
                }
                sendBusinessNotification(recieverBusiness.fcmToken , title , body, actions)
            }
        }
    catch(err) {
        console.log(err)
    }
})

router.post('/get' , async (req, res) => {
    try {
        const messages = await Messages.find({
            convesationId : req.body.convesationId
        })
        res.status(200).send(messages)
    }
    catch(ex) {
        res.status(400).send({
            status: "something went wrong",
        }); 
       }
   
})


module.exports = router