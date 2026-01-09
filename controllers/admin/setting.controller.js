module.exports.list = async (req, res) => {
    res.render("admin/pages/setting-list", {
        pageTitle: "Trang cài đặt chung"
    });
}

module.exports.websiteInfo = async (req, res) => {
    res.render("admin/pages/setting-website-info", {
        pageTitle: "Trang thông tin website"
    });
}

module.exports.accountAdminList = async (req, res) => {
    res.render("admin/pages/setting-account-admin-list", {
        pageTitle: "Trang tài khoản quản trị"
    });
}

module.exports.accountAdminCreate = async (req, res) => {
    res.render("admin/pages/setting-account-admin-create", {
        pageTitle: "Trang tạo mới tài khoản quản trị"
    });
}

module.exports.settingRoleList = async (req, res) => {
    res.render("admin/pages/setting-role-list", {
        pageTitle: "Trang nhóm quyền"
    });
}

module.exports.settingRoleCreate = async (req, res) => {
    res.render("admin/pages/setting-role-create", {
        pageTitle: "Trang tạo nhóm quyền"
    });
}