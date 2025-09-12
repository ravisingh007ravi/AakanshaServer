const cloudinary = require('cloudinary').v2
const { AllError } = require("../error/errorhandling")
const sharp = require('sharp')
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

exports.UserLoadImg = async (img) => {
  try {
    const optimizedBuffer = await sharp(img)
      .resize(1080, 720, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true }).toBuffer();


    const uploadResult = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`,
      { resource_type: 'auto', quality: 'auto' });
    return uploadResult
  }
  catch (err) { AllError(err, res) }
}

exports.deleteProfileImg = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id)
  }
  catch (err) { AllError(err, res) }
}