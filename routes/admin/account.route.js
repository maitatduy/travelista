const router = require("express").Router();

const accounController = require("../../controllers/admin/account.controller");

router.get("/login", accounController.login);
router.get("/register", accounController.register);
router.get("/forgot-password", accounController.forgotPassword);
router.get("/otp-password", accounController.otpPassword);
router.get("/reset-password", accounController.resetPassword);

module.exports = router;