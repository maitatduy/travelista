const router = require("express").Router();

const cartController = require("../../controllers/client/cart.controller");

router.get("/", cartController.cart);
router.post("/detail", cartController.detail);

module.exports = router;
