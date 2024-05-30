const path = require("path")

const multer = require("multer")

// const storage = multer.diskStorage({
//     destination : function(req,file,cd) {
//         cd(null,"uploads/")
//     },
//     filename : function(req,file,cd){
//         cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
//     }
// })

// const upload = multer({storage : storage }) 

  // Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb)  {
    cb(null, path.join(__dirname,'../../uploads')); // Specify the upload directory
  },
  filename: function(req, file, cb)  {
    cb(null, Date.now()+file.originalname ); // Generate a unique filename
  },
});
  // Initialize Multer with the storage configuration
  
const upload = multer({ storage :storage });
module.exports = upload