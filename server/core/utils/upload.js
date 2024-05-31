const path = require("path")

const multer = require("multer")

const storage = multer.memoryStorage();


// const storage = multer.diskStorage({
//     destination : function(req,file,cd) {
//         cd(null,"uploads/")
//     },
//     filename : function(req,file,cd){
//         cd(null,Date.now()+ path.extname(file.originalname))
//     }
// })

  // Initialize Multer with the storage configuration
const upload = multer({ storage });
module.exports = upload