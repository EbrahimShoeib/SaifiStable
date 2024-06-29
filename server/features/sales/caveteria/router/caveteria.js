

const express = require ("express")
const caveteriaController = require ("../controller/caveteria-controller")
const upload = require("../../../../core/utils/upload");

router = express.Router()


router.get("/" ,caveteriaController.getAllMenueItem)
router.get("/:id",caveteriaController.getMenuItemById)
router.post("/",caveteriaController.createNewMenueItem)
router.patch("/:id",caveteriaController.updateMenuItem)
router.delete("/:id",caveteriaController.deleteMenuItem)

router.post(
    "/upload-image/:id",
    upload.single('image'),
    caveteriaController.uploadCaveteriaImage
);

router.get(
    "/upload-image/:id",
    caveteriaController.getCaveteriaImage
);
module.exports = router