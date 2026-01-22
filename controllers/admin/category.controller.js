const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");

module.exports.list = async function (req, res) {
    res.render("admin/pages/category-list", {
        pageTitle: "Trang quản lý danh mục"
    });
}

module.exports.create = async function (req, res) {
    const categoryList = await Category.find({
        deleted: false
    });

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    res.render("admin/pages/category-create", {
        pageTitle: "Trang tạo danh mục",
        categoryList: categoryTree
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

    req.flash("success", "Tạo danh mục thành công!");

    res.json({
        code: "success"
    });

}