const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AccountAdmin = require("../../models/account-admin.model");

module.exports.login = async (req, res) => {
    res.render("admin/pages/login", {
        pageTitle: "Trang đăng nhập"
    });
}

module.exports.loginPost = async (req, res) => {
    try {
        const {email, password, rememberPassword} = req.body;
        const existAccount = await AccountAdmin.findOne({
            email
        });

        if (!existAccount) {
            return res.json({
                code: "error",
                message: "Email không tồn tại trong hệ thống!"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, existAccount.password);

        if (!isPasswordValid) {
            return res.json({
                code: "error",
                message: "Email hoặc mật khẩu không chính xác!"
            });
        }

        if (existAccount.status !== "active") {
            return res.json({
                code: "error",
                message: "Tài khoản chưa được kích hoạt!"
            });
        }

        // Tạo JWT
        const token = jwt.sign(
            {
                id: existAccount.id,
                email: existAccount.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: rememberPassword ? "30d" : "1d"
            }
        );

        // Lưu token vào cookie
        res.cookie("token", token, {
            maxAge: rememberPassword ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "strict"
        });

        return res.json({
            code: "success",
            message: "Đã đăng nhập thành công!"
        })

    } catch (error) {
        return res.json({
            code: "error",
            message: "Lỗi hệ thống!"
        })
    }
}

module.exports.register = async (req, res) => {
    res.render("admin/pages/register", {
        pageTitle: "Trang đăng ký"
    });
}

module.exports.registerInitial = async (req, res) => {
    res.render("admin/pages/register-initial", {
        pageTitle: "Trang duyệt tài khoản"
    });
}

module.exports.registerPost = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
        const existAccount = await AccountAdmin.findOne({
            email: email
        });

        if (existAccount) {
            return res.json({
                code: "error",
                message: "Email đã tồn tại trong hệ thống!"
            });
        }
        // Mã hóa mật khẩu với bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new AccountAdmin({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            status: "initial"
        });
        await newAccount.save();
        return res.json({
            code: "success",
            message: "Đăng ký tài khoản thành công!"
        });
    } catch (error) {
        return res.json({
            code: "error",
            message: "Lỗi hệ thống!"
        })
    }
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

module.exports.logoutPost = async (req, res) => {
    res.clearCookie("token");
    return res.json({
        code: "success",
        message: "Đăng xuất thành công"
    });
}