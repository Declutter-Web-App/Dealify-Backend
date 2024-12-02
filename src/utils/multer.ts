import multer from "multer"
import fs from "fs"

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads")
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

export default upload
