

const express = require ("express")
const caveteriaController = require ("../controller/caveteria-controller")
router = express.Router()


router.get("/" ,caveteriaController.getAllMenueItem)
router.get("/:id",caveteriaController.getMenuItemById)
router.post("/",caveteriaController.createNewMenueItem)
router.patch("/:id",caveteriaController.updateMenuItem)
router.delete("/:id",caveteriaController.deleteMenuItem)

router.post(
    "/upload-image/:id",
    upload.single('image'),
    caveteriaController.uploadImage
);
  
router.get(
    "/upload-image/:id",
    caveteriaController.getImage
);
module.exports = router