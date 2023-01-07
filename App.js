const express = require("express");
var app = express();
const mongoose = require('mongoose')
const users = require('./routes/signIn')
const u_users = require('./routes/u_signin')
const facility = require('./routes/facility')
const sports = require('./routes/sports')
const slots = require('./routes/slots')
const pitch = require('./routes/pitch')
const messages = require('./routes/messages')
const conversation = require('./routes/conversation')
const booking = require('./routes/booking')
const contact = require('./routes/contactUs')
const u_contact = require('./routes/u_ContactUs')
const hostActivity = require('./routes/u_HostActivity')
const u_slots = require('./routes/u_Slots')
const dashboard = require('./routes/Dashbaord')
const offers = require('./routes/offers')
const venueFacilities = require('./routes/venueFacilities')
const wallet = require('./routes/wallet')
const train = require('./routes/train')
const banners = require('./routes/Banners')
const terms_policy = require('./routes/termsAndPolicy')

const socketRoute = require('./socket/socket')
const cors = require('cors')

const DB = 'mongodb://dbGoPlay:dbGoPlayPassword@goplay-shard-00-00.gpvkt.mongodb.net:27017,goplay-shard-00-01.gpvkt.mongodb.net:27017,goplay-shard-00-02.gpvkt.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-5215jz-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(DB)
.then(()=>{
    console.log("connected to mongoDb")
})
.catch((ex)=> {
    console.log(ex)
});

const { createServer } = require("http");
const { Server } = require("socket.io");
const BookActivity = require("./routes/u_BookActivity");

const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: {
      origin: "*",
      credentials: true
    }
});

let TotalUsers  = []

const addUser = (userId , SocketId)=> { 
    !TotalUsers.some((user)=> user.userId === userId ) &&
    TotalUsers.push({userId , SocketId})
}

const removeUser = (SocketId) => {
    TotalUsers = TotalUsers.filter(user => user.SocketId !== SocketId )
}

const getUser = (userId) => {
    return TotalUsers.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    //when connected
    console.log("user Connected" , socket.id)
    socket.on("addUser" , (user)=> {
        addUser(user , socket.id)
        io.emit("getUsers" , TotalUsers)
    })

    //send and get messages
    socket.on("sendMessage" , ({senderId , recieverId , text , senderName})=> {
        console.log(TotalUsers)
        const user = getUser(recieverId)
        try{
            io.to(user.SocketId).emit("getMessage" , {
                sender : senderId,
                senderName : senderName,
                text,
                updatedAt : new Date()
            })      
        }
        catch(ex){
            console.log(ex)
        }
     

    })

    //when disconnected
    socket.on("disconnect" , ()=> {
        console.log("a user disconnected")
        removeUser(socket.id)
    })
});
app.use(express.json({limit : '20mb'}))
// app.use(express.static('public'));
app.use( express.static(__dirname + '/images'));

app.set('io' , io)
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(cors());
app.use('/api/users' , users);
app.use('/api/userApp/users' , u_users);
app.use('/api/facility' , facility);
app.use('/api/sports' , sports)
app.use('/api/venueFacilities' , venueFacilities)
app.use('/api/pitch' , pitch)
app.use('/api/slots' , slots)
app.use('/api/conversation' , conversation)
app.use('/api/messages' , messages)
app.use('/api/booking' , booking)
app.use('/api/contact' , contact)
app.use('/api/dashboard' , dashboard)
app.use('/api/userApp/hostActivity' , hostActivity)
app.use('/api/userApp/bookActivity' , BookActivity)
app.use('/api/userApp/slots' , u_slots)
app.use('/api/userApp/offers' , offers)
app.use('/api/userApp/wallet' , wallet)
app.use('/api/userApp/train' , train)
app.use('/api/userApp/banner' , banners)
app.use('/api/userApp/contact' , u_contact)
app.use('/api/termsPolicy' , terms_policy)




const port = app.get('port')
httpServer.listen(port , ()=> console.log(`Listening to port number ${port}...`));

module.exports.app = app
