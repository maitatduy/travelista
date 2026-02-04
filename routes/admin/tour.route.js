const router = require("express").Router();

const tourController = require("../../controllers/admin/tour.controller");
const tourValidate = require("../../validates/admin/tour.validate");

const multer = require("multer");

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({
    storage: cloudinaryHelper.storage,
});

router.get("/list", tourController.list);

router.get("/create", tourController.create);
router.post(
    "/create",
    tourValidate.createPost,
    upload.single("avatar"),
    tourController.createPost,
);

router.get("/trash", tourController.trash);

module.exports = router;
