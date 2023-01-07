const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    sender : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    },
    reciever : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    },   
    reason  : String, 
    amount : Number , 
    trasactionID : Number,

}
,
{timestamps : true}    

)

const requestSchema = new mongoose.Schema({
    requestFrom : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    },
    requestTO : {
        type :   mongoose.Schema.Types.ObjectId,
        ref : "u_User"
    },   
    reason  : String, 
    amount : Number , 
}
,
{timestamps : true}    

)

const transactionId = new mongoose.Schema({
    trasactionId : {
        type : Number ,
        default : 1
    }
})
const TransactionId = mongoose.model('Transaction' , transactionId)
const RequestSchema = mongoose.model('Request' , requestSchema)
const Wallet = mongoose.model('Wallet' , walletSchema )

module.exports.Wallet = Wallet;
module.exports.TransactionId = TransactionId
module.exports.Request = RequestSchema
