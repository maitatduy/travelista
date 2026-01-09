module.exports.list = async function (req, res) {
    res.render("admin/pages/category-list", {
        pageTitle: "Trang quản lý danh mục"
    });
}

module.exports.create = async function (req, res) {
    res.render("admin/pages/category-create", {
        pageTitle: "Trang tạo danh mục"
    });
}