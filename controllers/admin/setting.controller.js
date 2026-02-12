const SettingWebsiteInfo = require("../../models/setting-website-info");
const Role = require("../../models/role.model");
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
    res.render("admin/pages/setting-account-admin-list", {
        pageTitle: "Trang tài khoản quản trị",
    });
};

module.exports.accountAdminCreate = async (req, res) => {
    res.render("admin/pages/setting-account-admin-create", {
        pageTitle: "Trang tạo mới tài khoản quản trị",
    });
};

module.exports.settingRoleList = async (req, res) => {
    const roleList = await Role.find({
        deleted: false,
    });

    console.log(roleList);
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
