import { Request } from "express"
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadManager = (destination: string) => {
  return multer({
    storage: new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `Dealify/${destination}`,
        resource_type: "auto",
      },
    }),
    fileFilter,
  });
}

function fileFilter(req: Request, file: any, cb: any) {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/mov"];
  
  if (allowedTypes.includes(file.mimetype) && req.get("Authorization") !== undefined) {
    cb(null, true);  // Accept the file if it's an image or video
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."), false);
  }
}


export default uploadManager