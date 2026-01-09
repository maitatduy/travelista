module.exports.login = async (req, res) => {
    res.render("admin/pages/login", {
        pageTitle: "Trang đăng nhập"
    });
}

module.exports.register = async (req, res) => {
    res.render("admin/pages/register", {
        pageTitle: "Trang đăng ký"
    });
}

module.exports.forgotPassword = async (req, res) => {
    res.render("admin/pages/forgot-password", {
        pageTitle: "Trang quên mật khẩu"
    });
}

module.exports.otpPassword = async (req, res) => {
    res.render("admin/pages/otp-password", {
        pageTitle: "Trang quên mật khẩu"
    });
}

module.exports.resetPassword = async (req, res) => {
    res.render("admin/pages/reset-password", {
        pageTitle: "Trang đổi mật khẩu"
    });
}