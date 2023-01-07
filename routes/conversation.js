const express = require("express");
const router = express();
const Conversation = require("../models/conversation");
const Messages = require("../models/messages");
const auth = require('../middlewares/auth').u_auth
const b_auth = require('../middlewares/auth')
const u_User = require ('../models/u_user')
const b_User = require ('../models/user')



router.post('/create' , auth , b_auth ,  async(req, res) => {
    try{

    const conversation = new Conversation({
        receiver : req.body.receiverID,
        members : [ req.user.id._id , req.body.receiverID]
    })
    const alreadyStarted = await Conversation.find({
        isGroup : false,
        members : { $all : [req.user.id._id  , req.body.receiverID]  }
    })
        if (alreadyStarted[0]) { 
            return res.status(200).send({
                status : true,
                message : "Conversation has been already started",
                conversation : alreadyStarted[0]
            })
        }
        await conversation.save()
        res.status(200).send({
            status : true , 
            conversation : conversation,
            message : "Conversation has been successfully created"
        })
    }
    catch { 
        res.status(400).send({
            status: "something went wrong",
        });
    }
})

router.post('/createGroup' , auth , async(req, res) => {
    try{

    const conversation = new Conversation({
        groupName : req.body.groupName,
        members : req.body.members,
        groupOwner : req.user.id._id,
        isGroup : true,
        isActive : true
    })


        await conversation.save()
        res.status(200).send({
            status : true , 
            conversation : conversation,
            message : "Conversation has been successfully created"
        })
    }
    catch { 
        res.status(400).send({
            status: "something went wrong",
        });
    }
})


router.post('/deleteGroup' , auth , async (req , res)=> { 
  try {
    const deleteGroup = await Conversation.findByIdAndDelete(req.body.convoId)

    res.status(200).send({
      status : true , 
      message : "Conversation has been successfully delete"
  })

  const deleteMessages = await Messages.deleteMany({
      convesationId : req.body.convoId
  })
  } catch (error) {
      
  }

})

router.post('/deleteGroupAsAdmin'  , async (req , res)=> { 
    try {
      const deleteGroup = await Conversation.findByIdAndDelete(req.body.convoId)
  
      res.status(200).send({
        status : true , 
        message : "Conversation has been successfully delete"
    })
  
    const deleteMessages = await Messages.deleteMany({
        convesationId : req.body.convoId
    })
    } catch (error) {
        
    }
  })

router.post('/get' , auth , b_auth,  async (req, res) => {
    try { 
        const conversation = await Conversation.find({
            members : { $in : [req.user.id._id]  },
            isActive : true
        }).sort({updatedAt: -1})
            
        for (let index = 0; index < conversation.length; index++) {
            const item = conversation[index];
            const friendsData = item.members.filter((item)=> String(item) !== String(req.user.id._id))
            let user1 = await u_User.findById(friendsData[0])
            if(!user1) {
                user1 = await b_User.findById(friendsData[0])
            }
            conversation[index].testingMembers.push(user1)
        } 


        res.status(200).send({
            status : true , 
            conversation : conversation,
            // friendsData : user1
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({
            status: err,
        });
    }
})

router.post('/getMyGroups' , auth ,  async (req, res) => {
    try { 
        const conversation = await Conversation.find({
            members : { $in : [req.user.id._id]  },
            isActive : true,
            isGroup : true
        }).populate('members groupOwner')

        res.status(200).send({
            status : true , 
            conversation : conversation.reverse()
        })
    }
    catch (err) {
        res.status(400).send({
            status: err,
        });
    }
})

router.post('/getAllGroups'  ,  async (req, res) => {
    try { 
        const conversation = await Conversation.find({
            // members : { $nin : [req.user.id._id]  },
            isActive : true,
            isGroup : true,
            isPublicGroup : false

        }).populate('members groupOwner')
        console.log(conversation)
        res.status(200).send({
            status : true , 
            conversation : conversation.reverse()
        })
    }
    catch (err) {
        res.status(400).send({
            status: err,
        });
    }
})

router.post('/getOtherGroups' , auth ,  async (req, res) => {
    try { 
        const conversation = await Conversation.find({
            members : { $nin : [req.user.id._id]  },
            isActive : true,
            isGroup : true,
            isPublicGroup : true

        }).populate('members groupOwner')

        res.status(200).send({
            status : true , 
            conversation
        })
    }
    catch (err) {
        res.status(400).send({
            status: err,
        });
    }
})

router.post('/getAllPublicGroups'  ,  async (req, res) => {
    try { 
        const conversation = await Conversation.find({
            isActive : true,
            isGroup : true,
            isPublicGroup : true

        }).populate('members')

        res.status(200).send({
            status : true , 
            conversation
        })
    }
    catch (err) {
        res.status(400).send({
            status: err,
        });
    }
})

router.post('/joinGroup' , auth , async (req, res) => { 
        try {
            const conversation = await Conversation.findById(req.body.convoId)
            conversation.members.push(req.user.id._id)
            await conversation.save()
            res.status(200).send({
                status : true , 
            })
        }
        catch {
            res.status(400).send({
                status: err,
            });
        }
} )

router.post('/kickMember' , auth ,  async (req, res) => {
    try { 
        const conversation = await Conversation.findById(req.body.convoId)
       conversation.members = await conversation.members.filter(item => item != req.body.member)
        await conversation.save()

        res.status(200).send({
            status : true , 
            conversation
        })
    }
    catch (err) {
        res.status(400).send({
            status: err,
        });
    }
})

router.post('/KickAsAdmin' ,  async (req, res) => {
    try { 
        const conversation = await Conversation.findById(req.body.convoId)
        req.body.members.forEach(element => {
            conversation.members =  conversation.members.filter(item => item != element)
             conversation.save()
        });

        res.status(200).send({
            status : true , 
            message : "Successfully kicked"
        })
    }
    catch (err) {
        res.status(400).send({
            status: err,
        });
    }
})

router.post('/blockUser' , auth , async(req , res) => {
    try{ 
        const conversation = await Conversation.findById(req.body.convoId)
        conversation.blockedUser.push(req.body.blockedUser)
        conversation.save()
        res.status(200).send({
            status :  true , 
            message : "User has been Blocked"
        })
    }
    catch {

    }
} )

router.post('/leaveGroup' , auth , async(req , res) => {
    try{ 
        const conversation = await Conversation.findById(req.body.convoId)
        let removeUser = conversation.members.filter(item => String(item) !== String(req.user.id._id))
        conversation.members = removeUser
        conversation.save()
        res.status(200).send({
            status :  true , 
            message : "You have leaved the Group"
        })
    }
    catch(ex) {
        console.log(ex)
    }
} )

router.post('/UnblockUser' , auth , async(req , res) => {
    try{ 
        const conversation = await Conversation.findById(req.body.convoId)
        conversation.blockedUser.pop(req.body.blockedUser)
        conversation.save()
        res.status(200).send({
            status :  true , 
            message : "User has been UnBlocked"
        })
    }
    catch {

    }
} )

router.post('/handleDelete' , auth , async(req , res) => {
    try{ 
        const conversation = await Conversation.findById(req.body.convoId)
        conversation.hideTo.push(req.body.hideTo)
        conversation.save()
        res.status(200).send({
            status :  true , 
            message : "Chat has been deleted"
        })
    }
    catch {

    }
} )

router.post('/createPublicGroup'  , async(req, res) => {
    const conversation = new Conversation({
        groupName : req.body.groupName,
        members : [],
        groupOwner : "62422c1b5ef41f29cee57acb",
        isGroup : true,
        isActive : true,
        isPublicGroup : true,
    })

    try{
        await conversation.save()
        res.status(200).send({
            status : true , 
            conversation : conversation,
            message : "Group has been successfully created"
        })
    }
    catch { 
        res.status(400).send({
            status: "something went wrong",
        });
    }
})

module.exports = router