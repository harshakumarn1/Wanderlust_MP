if( process.env.NODE_ENV != "production" ) {
    require('dotenv').config(); // only used while development stage
}
// console.log(process.env.CLOUD_NAME)

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlast_listing_images',
      allowedFormats: ["png", "jpeg", "jpg", "pdf"]
    }
  });

  module.exports = storage;
  