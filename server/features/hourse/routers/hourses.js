//const hourseController = require("../controller/horses-controller")

const upload = require("../../../core/utils/upload");
const {verifyTokenAndAdmin} = require('../../../core/middleware/verify-token')

const HourseController =require("../controller/horses-controller")
const express = require("express");

router = express.Router();

//>>>>>>>>>>>>>>>>>>>> Start Code Here <<<<<<<<<<<<<<<<<<<<<<<<

/**
 * @desc create New Hourse
 * @route api/hourse
 * @method Post
 * @access public
 */
router.post("/",verifyTokenAndAdmin, HourseController.createNewHourse);

/**
 * @desc Get Hourses
 * @route api/hourse
 * @method Get
 * @access public
 */
router.get("/",verifyTokenAndAdmin,HourseController.getAllHourses);

/**
 * @desc Get Hourse By id
 * @route api/hourse/:id
  * @method Get
  * @access public
*/
router.get("/:id",verifyTokenAndAdmin,HourseController.getHourseById);

/**
 * @desc Update Hourse
 * @route api/hourse/:id
 * @method put
 * @access public
 */
router.patch("/:id",verifyTokenAndAdmin,HourseController.updateHourse)

/**
 * @desc  Hourse
 * @route api/hourse/:id
 * @method delete
 * @access public
 */
router.delete("/:id",verifyTokenAndAdmin,HourseController.deleteHourse)

/**
* @desc Get all Clients
* @route api/Client/
* @method Get
* @access private
*/
router.post(
  "/upload-image/:id",
  upload.single('image'),
  HourseController.uploadHourseImage
);

router.get(
  "/upload-image/:id",
  HourseController.getHourseImage
);

module.exports = router;
