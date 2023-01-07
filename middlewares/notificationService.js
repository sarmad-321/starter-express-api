var admin = require("firebase-admin");
var serviceAccount = require("../goplayuser-68af6-firebase-adminsdk-xv54s-9f61ffb532.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });


   const sendNotification = async(fcmToken , title , message , actions)=> { 

    await admin.messaging().sendMulticast({
        tokens: [
            fcmToken
          /* ... */
        ], // ['token_1', 'token_2', ...]
        data : actions,
        notification: {
          title: title,
          body: message,
        },

      }).then(()=> console.log("Successfully sent notification"))
      .catch((ex)=> console.log("Not sent successfully !" , ex));

}

module.exports.sendNotification = sendNotification