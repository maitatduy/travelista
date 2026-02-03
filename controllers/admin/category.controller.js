const Category = require("../../models/category.model");
const AccountAdmin = require("../../models/account-admin.model");
const categoryHelper = require("../../helpers/category.helper");
const moment = require("moment");

module.exports.list = async function (req, res) {
    const find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status;
    }
    if (req.query.createdBy) {
        find.createdBy = req.query.createdBy;
    }

    const dateFilter = {};

    if (req.query.startDate) {
        const startDate = moment(req.query.startDate).startOf("date").toDate();
        dateFilter.$gte = startDate;
    }

    if (req.query.endDate) {
        const endDate = moment(req.query.endDate).endOf("date").toDate();
        dateFilter.$lte = endDate;
    }

    if (Object.keys(dateFilter).length > 0) {
        find.createdAt = dateFilter;
    }

    const categoryList = await Category.find(find).sort({
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

    // Danh sách tài khoản quản trị
    const accountAdminList = await AccountAdmin.find({}).select("id fullName");

    res.render("admin/pages/category-list", {
        pageTitle: "Trang quản lý danh mục",
        categoryList: categoryList,
        accountAdminList: accountAdminList,
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

module.exports.edit = async function (req, res) {
    try {
        const categoryList = await Category.find({
            deleted: false,
        });

        const categoryTree = categoryHelper.buildCategoryTree(categoryList);

        const id = req.params.id;

        const categoryDetail = await Category.findOne({
            _id: id,
        });

        res.render("admin/pages/category-edit", {
            pageTitle: "Trang chỉnh sửa",
            categoryList: categoryTree,
            categoryDetail: categoryDetail,
        });
    } catch (error) {
        res.redirect(`/${pathAdmin}/category/list`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.body.position !== undefined && req.body.position !== "") {
            req.body.position = Number(req.body.position);
        } else {
            const totalRecord = await Category.countDocuments();
            req.body.position = totalRecord + 1;
        }

        req.body.updatedBy = req.account.id;
        if (req.file) {
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }

        await Category.updateOne(
            {
                _id: id,
                deleted: false,
            },
            req.body,
        );

        req.flash("success", "Cập nhật danh mục thành công!");

        res.json({
            code: "success",
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!",
        });
    }
};

module.exports.deletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Category.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedBy: req.account.id,
                deletedAt: Date.now(),
            },
        );

        req.flash("success", "Xóa danh mục thành công!");

        res.json({
            code: "success",
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!",
        });
    }
};

module.exports.changeMultiPatch = async (req, res) => {
    try {
        const { option, ids } = req.body;
        if (option === "active" || option === "inactive") {
            await Category.updateMany(
                {
                    _id: { $in: ids },
                },
                {
                    status: option,
                },
            );
        } else if (option === "delete") {
            await Category.updateMany(
                {
                    _id: { $in: ids },
                },
                {
                    deleted: true,
                    deletedBy: req.account.id,
                    deletedAt: Date.now(),
                },
            );
            req.flash("success", "Xóa thành công!");
        }
        req.flash("success", "Đổi trạng thái thành công!");
        res.json({
            code: "success",
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!",
        });
    }
};
