const router = require("express").Router();

const tourRoutes = require("./tour.route");

router.use("/tours", tourRoutes);

module.exports = router;