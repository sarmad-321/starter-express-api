var admin = require("firebase-admin");
var serviceAccount = require("../goplay-f0fd6-firebase-adminsdk-y9b94-696a1f8dc4.json")
var axios = require('axios')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, 'goplay-f0fd6');


   const sendNotification = async(fcmToken , title , message , actions)=> { 
     let data = {
      "to": fcmToken,
      "notification": {
        "title": title,
        "body": message,
        "mutable_content": true,
        "sound": "Tri-tone"
        },
  
     "data":actions,
       "priority": "high"

     }
   await axios.default.post('https://fcm.googleapis.com/fcm/send' , data , {
        headers : {
          Authorization : 'Key=AAAA5sCLJo0:APA91bFyI6WdMKRLFeuVoNMr8iIhLmBaRReFPou94XPuC-zMoik58Q0zSYyGCgb5yr18__UvbetqBfhbLlkP0rYXxPY7pczKtxtPEOOXp8CiEo-1Dls2TgUSuhuv6h4G--kwCmAsQ34l'
        }
      }).then(()=> console.log("Successfully sent notification"))
      .catch((err)=> console.log("Not sent successfully !", err));
    // await admin.messaging().sendMulticast({
    //     tokens: [
    //         fcmToken
    //       /* ... */
    //     ], // ['token_1', 'token_2', ...]
    //     data : actions,
    //     notification: {
    //       title: title,
    //       body: message,
    //     },
    //     android : {
    //       priority : "high"
    //     },

    //   }).then(()=> console.log("Successfully sent notification"))
    //   .catch(()=> console.log("Not sent successfully !"));

}

module.exports.sendBusinessNotification = sendNotification