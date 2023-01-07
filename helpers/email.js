const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   host: 'go-playapp.com',
   port : 465,
   secure : true,
   auth : {
       user : "support@go-playapp.com",
       pass : "goplay@123"
   }
})

async function sendEmail (email) {
    const encryptedEmail = Buffer.from(email).toString('base64')

    const options = {
        from : "support@go-playapp.com",
        to : email,
        subject : "Confirmation Email",
        text : `please click the link to verify your email https://go-play-beta.herokuapp.com/api/users/confirmation?email=${encryptedEmail}`
    }



 const response =  transporter.sendMail(options , (err , info) => {
        if (err) {
            console.log("error" ,err)
            return
        }
        return info.response
    })

}

module.exports.sendEmail = sendEmail