const jwt = require('jsonwebtoken')
const Users = require('../models/user')
const u_user = require('../models/u_user')

async function auth (req , res , next) { 
    const token = req.header('Authorization').split("Bearer ")[1]
    if (!token) {
        return res.status(401).send("Access denied , no token provided")
    }
    try {
        const decoded = jwt.verify(token , 'privateKey')
        let result = await Users.findById(decoded.id)
        if(result){
            req.user = decoded
            next()
        }
       else {
           next()
       }
    }
    catch (ex) { 
            next()
    }
}

async function u_auth (req , res , next) { 
    const token = req.header('Authorization').split("Bearer ")[1]
    if (!token) {
        return res.status(401).send("Access denied , no token provided")
    }
    try {
        const decoded = jwt.verify(token , 'privateKey')
        let result = await u_user.findById(decoded.id)
        if(result){
            req.user = decoded
            next()
        }
       else {
           next()
       }
    }
    catch (ex) { 
        next()
    }
}
module.exports = auth;
module.exports.u_auth = u_auth