// const express = require("express");
// const router = express();


// let TotalUsers  = []

// const addUser = (userId , SocketId)=> { 
//     !TotalUsers.some((user)=> user.userId === userId ) &&
//     TotalUsers.push({userId , SocketId})
// }

// const removeUser = (SocketId) => {
//     TotalUsers = TotalUsers.filter(user => user.SocketId !== SocketId )
// }

// const getUser = (userId) => {
//     return TotalUsers.find(user => user.userId === userId)
// }


// router.get('/' , (req , res) => {
//     console.log('inside socket api')
//     var io = req.app.get('io')
//    io.on("connection", (socket) => {
//     //when connected
//     console.log("user Connected")
//     socket.on("addUser" , (user)=> {
//         addUser(user , socket.id)
//         io.emit("getUsers" , TotalUsers)
//     })

//     //send and get messages
//     socket.on("sendMessage" , ({senderId , recieverId , text})=> {
//         const user = getUser(recieverId)
//         io.to(user.SocketId).emit("getMessage" , {
//             sender : senderId,
//             text,
//             updatedAt : new Date()
//         })

//     })

//     //when disconnected
//     socket.on("disconnect" , ()=> {
//         console.log("a user disconnected")
//         removeUser(socket.id)
//     })
// });

//     res.status(200).send({
//         status : true,
        
//     })
// } )

// module.exports = router