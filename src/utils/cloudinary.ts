import { v2 } from "cloudinary";
import fs from "fs";

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  locaFilePath: string
): Promise<{ message: string; url?: string }> {
  // locaFilePath: path of image which was just
  // uploaded to "uploads" folder

  var mainFolderName = "main"
  // filePathOnCloudinary: path of image we want
  // to set when it is uploaded to cloudinary
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath

  return v2.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then((result: Record<any, any>) => {
      // Image has been successfully uploaded on
      // cloudinary So we dont need local image
      // file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath)

      return {
        message: "Success",
        url: result.url,
      }
    })
    .catch((error: any) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath)
      return { message: "Fail" }
    })
}
