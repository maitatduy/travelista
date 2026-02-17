const SettingWebsiteInfo = require("../../models/setting-website-info");
const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const permissionConfig = require("../../config/permission.config");

module.exports.list = async (req, res) => {
    res.render("admin/pages/setting-list", {
        pageTitle: "Trang cài đặt chung",
    });
};

module.exports.websiteInfo = async (req, res) => {
    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

    res.render("admin/pages/setting-website-info", {
        pageTitle: "Trang thông tin website",
        settingWebsiteInfo: settingWebsiteInfo,
    });
};

module.exports.websiteInfoPatch = async (req, res) => {
    if (req.files && req.files.logo) {
        req.body.logo = req.files.logo[0].path;
    } else {
        delete req.body.logo;
    }

    if (req.files && req.files.favicon) {
        req.body.favicon = req.files.favicon[0].path;
    } else {
        delete req.body.favicon;
    }
    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});
    if (settingWebsiteInfo) {
        await SettingWebsiteInfo.updateOne(
            {
                _id: settingWebsiteInfo,
            },
            req.body,
        );
    } else {
        const newRecord = new SettingWebsiteInfo(req.body);
        await newRecord.save();
    }
    req.flash("success", "Cập nhật thông tin website thành công!");
    res.json({
        code: "success",
    });
};

module.exports.accountAdminList = async (req, res) => {
    const find = {
        deleted: false,
    };

    // Filter
    if (req.query.status) {
        find.status = req.query.status;
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
    // End Filter
    // Search
    if (req.query.keyword) {
        const keyword = req.query.keyword;
        const keywordRegex = new RegExp(keyword, "i");
        find.fullName = keywordRegex;
    }
    // End Search

    // Pagination
    const limitItems = 5;
    let page = 1;
    if (req.query.page) {
        const currentPage = parseInt(req.query.page);
        if (currentPage > 0) {
            page = currentPage;
        }
    }
    const totalRecord = await AccountAdmin.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    if (page > totalPage && totalPage > 0) {
        page = totalPage;
    }

    if (page < 1) {
        page = 1;
    }
    const skip = (page - 1) * limitItems;
    const pagination = {
        skip: skip,
        totalRecord: totalRecord,
        totalPage: totalPage,
    };
    // End Pagination
    const accountAdminList = await AccountAdmin.find(find).sort({
        createdAt: "desc",
    });

    for (const item of accountAdminList) {
        if (item.role) {
            const roleInfo = await Role.findOne({
                _id: item.role,
            });

            if (roleInfo) {
                item.roleName = roleInfo.name;
            }
        }
    }

    const roleList = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/setting-account-admin-list", {
        pageTitle: "Trang tài khoản quản trị",
        accountAdminList: accountAdminList,
        roleList: roleList,
        pagination: pagination,
    });
};

module.exports.accountAdminCreate = async (req, res) => {
    const roleList = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/setting-account-admin-create", {
        pageTitle: "Trang tạo mới tài khoản quản trị",
        roleList: roleList,
    });
};

module.exports.accountAdminCreatePost = async (req, res) => {
    const existAccount = await AccountAdmin.findOne({
        email: req.body.email,
    });

    if (existAccount) {
        res.json({
            code: "error",
            message: "Email đã tồn tại trong hệ thống!",
        });
        return;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";

    // Mã hóa mật khẩu với bcrypt
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newAccount = new AccountAdmin(req.body);
    await newAccount.save();

    req.flash("success", "Tạo tài khoản quản trị thành công!");
    res.json({
        code: "success",
    });
};

module.exports.accountAdminEdit = async (req, res) => {
    try {
        const roleList = await Role.find({
            deleted: false,
        });

        const id = req.params.id;
        const accountAdminDetail = await AccountAdmin.findOne({
            _id: id,
            deleted: false,
        });

        if (!accountAdminDetail) {
            res.redirect(`/${pathAdmin}/setting/account-admin/list`);
            return;
        }

        res.render("admin/pages/setting-account-admin-edit", {
            pageTitle: "Chỉnh sửa tài khoản quản trị",
            roleList: roleList,
            accountAdminDetail: accountAdminDetail,
        });
    } catch (error) {
        res.redirect(`/${pathAdmin}/setting/account-admin/list`);
    }
};

module.exports.accountAdminEditPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.updatedBy = req.account.id;
        if (req.file) {
            req.body.avatar = req.file.path;
        } else {
            delete req.body.avatar;
        }

        // Mã hóa mật khẩu với bcrypt
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        await AccountAdmin.updateOne(
            {
                _id: id,
                deleted: false,
            },
            req.body,
        );

        req.flash("success", "Cập nhật tài khoản quản trị thành công!");

        res.json({
            code: "success",
        });
    } catch (error) {
        res.redirect(`/${pathAdmin}/setting/account-admin/list`);
    }
};

module.exports.accountAdminChangeMultiPatch = async (req, res) => {
    try {
        const { option, ids } = req.body;
        if (option === "active" || option === "inactive") {
            await AccountAdmin.updateMany(
                {
                    _id: { $in: ids },
                },
                {
                    status: option,
                },
            );
            req.flash("success", "Cập nhật thành công!");
            res.json({
                code: "success",
            });
        } else if (option === "delete") {
            await AccountAdmin.updateMany(
                {
                    _id: { $in: ids },
                },
                {
                    deleted: true,
                    deletedBy: req.account.id,
                    deletedAt: Date.now(),
                },
            );
            req.flash("success", "Cập nhật thành công!");
            res.json({
                code: "success",
            });
        }
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!",
        });
    }
};

module.exports.settingRoleList = async (req, res) => {
    const find = {
        deleted: false,
    };

    // Search
    if (req.query.keyword) {
        const keywordRegex = new RegExp(req.query.keyword, "i");
        find.name = keywordRegex;
    }
    // End Search
    const roleList = await Role.find(find);

    res.render("admin/pages/setting-role-list", {
        pageTitle: "Trang nhóm quyền",
        roleList: roleList,
    });
};

module.exports.settingRoleCreate = async (req, res) => {
    res.render("admin/pages/setting-role-create", {
        pageTitle: "Trang tạo nhóm quyền",
        permissionList: permissionConfig.permissionList,
    });
};

module.exports.roleCreatePost = async (req, res) => {
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();

    req.flash("success", "Tạo nhóm quyền thành công!");

    res.json({
        code: "success",
    });
};

module.exports.roleEdit = async (req, res) => {
    try {
        const id = req.params.id;

        const roleDetail = await Role.findOne({
            _id: id,
            deleted: false,
        });

        if (roleDetail) {
            res.render("admin/pages/setting-role-edit", {
                pageTitle: "Chỉnh sửa nhóm quyền",
                permissionList: permissionConfig.permissionList,
                roleDetail: roleDetail,
            });
        } else {
            res.redirect(`/${pathAdmin}/setting/role/list`);
        }
    } catch (error) {
        res.redirect(`/${pathAdmin}/setting/role/list`);
    }
};

module.exports.roleEditPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.updatedBy = req.account.id;

        await Role.updateOne(
            {
                _id: id,
                deleted: false,
            },
            req.body,
        );

        req.flash("success", "Cập nhật nhóm quyền thành công!");

        res.json({
            code: "success",
        });
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không tồn tại!",
        });
    }
};

module.exports.roleDeletePatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedBy: req.account.id,
                deletedAt: Date.now(),
            },
        );

        req.flash("success", "Xóa quyền thành công!");

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
        if (option === "delete") {
            await Role.updateMany(
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
            res.json({
                code: "success",
            });
        }
    } catch (error) {
        res.json({
            code: "error",
            message: "Id không hợp lệ!",
        });
    }
};
