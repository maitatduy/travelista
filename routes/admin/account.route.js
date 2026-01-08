const router = require("express").Router();

const accounController = require("../../controllers/admin/account.controller");

router.get("/login", accounController.login);
router.get("/register", accounController.register);

module.exports = router;