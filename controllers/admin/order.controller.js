module.exports.list = async (req, res) => {
    res.render("admin/pages/order-list", {
        pageTitle: "Trang quản lý đơn hàng"
    });
}

module.exports.edit = async (req, res) => {
    res.render("admin/pages/order-edit", {
        pageTitle: "Chi tiết đơn hàng"
    });
}