const path = require("path")

const multer = require("multer")

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});
// Initialize Multer with the storage configuration
const upload = multer({ storage });

module.exports = upload