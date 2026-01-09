module.exports.edit = async (req, res) => {
    res.render("admin/pages/profile-edit", {
        pageTitle: "Trang thông tin cá nhân"
    });
}

module.exports.changePassword = async (req, res) => {
    res.render("admin/pages/profile-change-password", {
        pageTitle: "Trang đổi mật khẩu"
    });
}