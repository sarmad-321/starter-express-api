const express = require("express");
const router = express();
const Banners = require("../models/banner");
const Facility = require ('../models/facility')
const auth = require('../middlewares/auth').u_auth
const fs = require('fs')
const moment = require('moment')


router.post('/' , async(req,res)=> { 
    try{ 
        const deletePrevious = await Banners.deleteMany()
        const dateTime = moment().unix()
        var screenshotUrl = []
        if (req.body.images){ 
            const folderPath = `./images/banner/`
            if(!fs.existsSync(folderPath)){
                fs.mkdirSync(folderPath)        
            }
            for (let index = 0; index < req.body.images.length; index++) {
                const randomNumber = Math.floor(Math.random() * 100);
                const element = req.body.images[index];
                if (element?.image ){
                    var base64Data = element.image.replace("data:image/png;base64,", "");
                    fs.writeFile(`${folderPath}/image${index +1}.png`, base64Data, 'base64' , function(err) {
                        console.log(err);
                      })    
                       screenshotUrl.push({
                           image : `/banner/image${index +1}.png`
                       })
                }
            }
        }
    
        console.log(screenshotUrl)
    
        const createBanner = new Banners({
            facilityId : req.body.facility,
            Images : screenshotUrl
            
        })
         createBanner.save()
         res.status(200).send({
             status : true , 
             message : "successfully has been added"
         })
    }
    catch (ex){
        console.log(ex)
    }
  
})


router.get('/' , async (req, res) => { 
try{ 
    const banners = await Banners.find().populate({
        path : 'facilityId',
        populate : {
            path : 'availableSport'
        }
    })

    return res.status(200).send({
        status : true , 
        banners : banners
    })

}
catch (ex) {
    console.log(ex)
}

})

module.exports = router