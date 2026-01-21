const router = require("express").Router();

const categoryController = require("../../controllers/admin/category.controller");

const multer = require("multer");
const upload = multer();

router.get("/list", categoryController.list);
router.get("/create", categoryController.create);
router.post("/create", upload.single("avatars"), categoryController.createPost);

module.exports = router;