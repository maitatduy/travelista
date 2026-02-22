const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");

module.exports.dashboard = async (req, res) => {
    // Section 1
    const overview = {
        totalAdmin: 0,
        totalUser: 0,
        totalOrder: 0,
        totalPrice: 0,
    };

    overview.totalAdmin = await AccountAdmin.countDocuments({
        deleted: false,
    });

    const orderList = await Order.find({
        deleted: false,
    });

    overview.totalOrder = orderList.length;

    overview.totalPrice = orderList.reduce((sum, item) => {
        return sum + item.total;
    }, 0);
    // End Section 1

    res.render("admin/pages/dashboard", {
        pageTitle: "Tổng quan",
        overview: overview,
    });
};
