const express = require("express");
const router = express();
const {Wallet}  = require("../models/wallet");
const {TransactionId}  = require("../models/wallet");
const {Request}  = require("../models/wallet");
const User = require('../models/u_user')
const auth = require('../middlewares/auth').u_auth


router.post('/transfer' , auth ,  async(req, res)=> {
    const transactionsId = await TransactionId.findById('62482a61043dc98342a99f1b')

    const wallet = new Wallet({
        sender : req.user.id._id,
        reciever : req.body.reciever,
        reason : req.body.reason,
        amount : req.body.amount,
        trasactionID : transactionsId?.trasactionId
    })
    

    await wallet.save()
    const user =  await User.findById(req.body.reciever)
    if (user) {
        user.wallet = user.wallet + parseInt(req.body.amount)
        await user.save()
    }
    const sender = await User.findById(req.user.id._id)
    if (sender) { 
        sender.wallet = sender.wallet - parseInt(req.body.amount)
        await sender.save()
    }
    res.status(200).send({
        status : true , 
        message : "Transaction has been successfully made"
    })
    transactionsId.trasactionId = transactionsId.trasactionId + 1
    transactionsId.save()
})


router.post('/acceptRequest', auth , async (req, res)=> { 
    const transactionsId = await TransactionId.findById('62482a61043dc98342a99f1b')

    const wallet = new Wallet({
        sender : req.user.id._id,
        reciever : req.body.reciever,
        reason : req.body.reason,
        amount : req.body.amount,
        trasactionID : transactionsId?.trasactionId
    })
    await wallet.save()
    
    const user =  await User.findById(req.body.reciever)
    if (user) {
        user.wallet = user.wallet + parseInt(req.body.amount)
        await user.save()
    }
    const sender = await User.findById(req.user.id._id)
    if (sender) { 
        sender.wallet = sender.wallet - parseInt(req.body.amount)
        await sender.save()
    }

    const request = await Request.findByIdAndDelete(req.body.requestId)

    res.status(200).send({
        status : true , 
        message : "Transaction has been successfully made"
    })

    transactionsId.trasactionId = transactionsId.trasactionId + 1
    transactionsId.save()
})

router.post('/declineRequest' , auth , async (req , res )=> {
    const request = await Request.findByIdAndDelete(req.body.requestId)

    res.status(200).send({
        status : true , 
        message : "Request declined successfully"
    })
} )

router.post('/request', auth , async (req, res)=> { 
    const request = new Request({
        requestFrom : req.user.id._id,
        requestTo : req.body.requestTo,
        reason : req.body.reason,
        amount : req.body.amount,
    })
    
    await request.save()

    res.status(200).send({
        status :  true ,
        message : 'Your request has been sent '
    })
})

router.get('/request', auth , async (req, res)=> { 
    const request = await Request.find({
        requestTo : req.user.id._id
    }).populate('requestFrom')
    
    res.status(200).send({
        status :  true ,
        request : request
    })
})

router.get('/' , auth , async (req , res) => {

        const wallet =  await Wallet.find({$or : [
            {
                sender : req.user.id._id
            },
            {
                reciever : req.user.id._id
            }
        ]}).populate('sender reciever')

        res.status(200).send({
            status : false , 
            transactions : wallet.reverse()
        })
})  



module.exports = router;