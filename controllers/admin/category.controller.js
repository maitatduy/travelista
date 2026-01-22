const Category = require("../../models/category.model");

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

module.exports.createPost = async function (req, res) {
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        const totalRecord = await Category.countDocuments({});
        req.body.positon = totalRecord + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    if (req.file) {
        req.body.avatar = req.file.path;
    } else {
        req.body.avatar = "";
    }

    const newCategory = new Category(req.body);
    await newCategory.save();

    return res.json({
        code: "success",
        message: "Tạo danh mục thành công!"
    });

}