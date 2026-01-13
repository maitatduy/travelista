const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AccountAdmin = require("../../models/account-admin.model");
const generateHelper = require("../../helpers/generate.helper");
const mailHelper = require("../../helpers/mail.helper");
const ForgotPassword = require("../../models/forgot-password.model");

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

module.exports.forgotPasswordPost = async (req, res) => {
    const {email} = req.body;

    // Kiểm tra xem email có tồn tại hay không
    const existAccount = await AccountAdmin.findOne({
        email: email
    });
    if (!existAccount) {
        return res.json({
            code: "error",
            messages: "Email không tồn tại trong hệ thống!"
        });
    }

    // Kiểm tra email đã gửi OTP hay chưa
    const existEmailInFogotPassword = await ForgotPassword.findOne({
        email: email
    });

    if (existEmailInFogotPassword) {
        return res.json({
            code: "error",
            message: "Vui lòng gửi lại yêu cầu sau 5 phút!"
        });
    }

    // Tạo mã OTP
    const otp = generateHelper.generateRandomNumber(6);

    // Lưu email và otp vào database. Sau năm phút sẽ tự động xóa bản ghi
    const newRecord = new ForgotPassword({
        email: email,
        otp: otp,
        expireAt: Date.now() + 5 * 60 * 1000
    });
    await newRecord.save();

    // Gửi email tự động cho người dùng
    const subject = "Travelista - Mã OTP lấy lại mật khẩu";

    const content = `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
  <tr>
    <td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background-color:#0d6efd; padding:20px; text-align:center; color:#ffffff;">
            <h2 style="margin:0; font-size:22px;">Travelista</h2>
            <p style="margin:10px 0 0; font-size:16px;">Xác thực lấy lại mật khẩu</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:30px;">
            <p style="font-size:15px; color:#333333;">
              Travelista xin chào,
            </p>

            <p style="font-size:15px; color:#333333;">
              Bạn đã yêu cầu lấy lại mật khẩu. Vui lòng sử dụng mã OTP bên dưới để tiếp tục:
            </p>

            <!-- OTP Box -->
            <div style="margin:25px 0; text-align:center;">
              <span style="
                display:inline-block;
                font-size:28px;
                letter-spacing:6px;
                font-weight:bold;
                color:#0d6efd;
                padding:12px 24px;
                border:2px dashed #0d6efd;
                border-radius:6px;
              ">
                ${otp}
              </span>
            </div>

            <p style="font-size:14px; color:#555555;">
              Mã OTP có hiệu lực trong <b>5 phút</b>.
            </p>

            <p style="font-size:14px; color:#999999;">
              Vui lòng <b>không chia sẻ mã này</b> cho bất kỳ ai để đảm bảo an toàn tài khoản.
            </p>

            <hr style="border:none; border-top:1px solid #eeeeee; margin:25px 0;">

            <p style="font-size:12px; color:#999999; text-align:center;">
              Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f8f9fa; padding:15px; text-align:center; font-size:12px; color:#777777;">
            © ${new Date().getFullYear()} Travelista. All rights reserved.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;


    mailHelper.sendMail(email, subject, content);

    return res.json({
        code: "success",
        message: "Đã gửi mã OTP qua email!"
    });
}

module.exports.otpPassword = async (req, res) => {
    res.render("admin/pages/otp-password", {
        pageTitle: "Trang quên mật khẩu"
    });
}

module.exports.otpPasswordPost = async (req, res) => {
    const {otp, email} = req.body;
    // Kiểm tra có tồn tại bản ghi trong ForgotPassword không
    const existRecord = await ForgotPassword.findOne({
        otp: otp,
        email: email
    });

    if (!existRecord) {
        return res.json({
            code: "error",
            message: "Mã OTP không chính xác!"
        });
    }
    // Tìm thông tin của người dùng trong AccountAdmin
    const account = await AccountAdmin.findOne({
        email: email
    });
    // Tạo JWT
    const token = jwt.sign(
        {
            id: account.id,
            email: account.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: rememberPassword ? "30d" : "1d"
        }
    );

    // Lưu token vào cookie
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });
    
    return res.json({
        code: "success",
        message: "Xác thực OTP thành công"
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