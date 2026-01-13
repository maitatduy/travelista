const router = require("express").Router();

const accountController = require("../../controllers/admin/account.controller");
const accountValidate = require("../../validates/admin/account.validate");

router.get("/login", accountController.login);
router.post("/login", accountValidate.loginPost, accountController.loginPost);
router.get("/register", accountController.register);
router.post("/register", accountValidate.registerPost, accountController.registerPost);
router.get("/forgot-password", accountController.forgotPassword);
router.post("/forgot-password", accountController.forgotPasswordPost);
router.get("/otp-password", accountController.otpPassword);
router.get("/reset-password", accountController.resetPassword);
router.get("/register-initial", accountController.registerInitial);
router.post("/logout", accountController.logoutPost);

module.exports = router;