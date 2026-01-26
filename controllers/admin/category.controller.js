const Category = require("../../models/category.model");
const AccountAdmin = require("../../models/account-admin.model");
const categoryHelper = require("../../helpers/category.helper");
const moment = require("moment");

module.exports.list = async function (req, res) {
    const categoryList = await Category.find({
        deleted: false,
    }).sort({
        position: "desc",
    });

    for (const item of categoryList) {
        if (item.createdBy) {
            const infoAccountCreated = await AccountAdmin.findOne({
                _id: item.createdBy,
            });
            item.createdByFullName = infoAccountCreated.fullName;
        }

        if (item.updatedBy) {
            const infoAccountUpdated = await AccountAdmin.findOne({
                _id: item.updatedBy,
            });
            item.updatedByFullName = infoAccountUpdated.fullName;
        }
        item.createdAtFormat = moment(item.createdAt).format(
            "HH:mm - DD/MM/YYYY",
        );
        item.updatedAtFormat = moment(item.createdAt).format(
            "HH:mm - DD/MM/YYYY",
        );
    }

    res.render("admin/pages/category-list", {
        pageTitle: "Trang quản lý danh mục",
        categoryList: categoryList,
    });
};

module.exports.create = async function (req, res) {
    const categoryList = await Category.find({
        deleted: false,
    });

    const categoryTree = categoryHelper.buildCategoryTree(categoryList);

    res.render("admin/pages/category-create", {
        pageTitle: "Trang tạo danh mục",
        categoryList: categoryTree,
    });
};

module.exports.createPost = async function (req, res) {
    console.log(req.body.status);
    if (req.body.position !== undefined && req.body.position !== "") {
        req.body.position = Number(req.body.position);
    } else {
        const totalRecord = await Category.countDocuments();
        req.body.position = totalRecord + 1;
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
        code: "success",
    });
};
