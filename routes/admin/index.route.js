const router = require("express").Router();

const accountRoutes = require("./account.route");
const dashboardRoutes = require("./dashboard.route");
const categoryRoutes = require("./category.route");
const tourRoutes = require("./tour.route");
const orderRoutes = require("./order.route");
const userRoutes = require("./user.route");
const contactRoutes = require("./contact.route");
const settingRoutes = require("./setting.route");
const profileRoutes = require("./profile.route");

router.use("/account", accountRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/category", categoryRoutes);
router.use("/tour", tourRoutes);
router.use("/order", orderRoutes);
router.use("/user", userRoutes);
router.use("/contact", contactRoutes);
router.use("/setting", settingRoutes);
router.use("/profile", profileRoutes);

// router.get(/.*/, (req, res) => {
//     res.render("admin/pages/error-404", {
//         pageTitle: "Trang không tồn tại"
//     });
// })

router.use((req, res) => {
    res.status(404).render("admin/pages/error-404", {
        pageTitle: "Trang không tồn tại"
    });
});

module.exports = router;