const router = require("express").Router();

const tourRoutes = require("./tour.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const contactRoutes = require("./contact.route");

const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

router.use(settingMiddleware.websiteInfo);
router.use(categoryMiddleware.categoryList);

router.use("/tours", tourRoutes);
router.use("/cart", cartRoutes);
router.use("/contact", contactRoutes);
router.use("/", homeRoutes);

module.exports = router;
