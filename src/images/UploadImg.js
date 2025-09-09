const cloudinary = require('cloudinary').v2
const {AllError} = require("../error/errorhandling")
require('dotenv').config()
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

exports.UserLoadImg = async (img)=>{
    try{

         const result = await cloudinary.uploader.upload(img)
        return result
    }
    catch(err){AllError(err,res)}

}