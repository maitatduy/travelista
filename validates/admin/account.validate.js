const Joi = require("joi");

module.exports.registerPost = (req, res, next) => {
    const registerSchema = Joi.object({
        fullName: Joi.string()
            .min(5)
            .max(50)
            .required()
            .messages({
                "string.empty": "Vui lòng nhập họ tên!",
                "string.min": "Họ tên phải có ít nhất 5 ký tự!",
                "string.max": "Họ tên không được vượt quá 50 ký tự!",
                "any.required": "Vui lòng nhập họ tên!"
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Vui lòng nhập email của bạn!",
                "string.email": "Email không đúng định dạng!",
                "any.required": "Vui lòng nhập email của bạn!"
            }),

        password: Joi.string()
            .min(8)
            .required()
            .custom((value, helpers) => {
                if (!/[A-Z]/.test(value)) {
                    return helpers.error("password.uppercase");
                }
                if (!/[a-z]/.test(value)) {
                    return helpers.error("password.lowercase");
                }
                if (!/\d/.test(value)) {
                    return helpers.error("password.number");
                }
                if (!/[@$!%*?&]/.test(value)) {
                    return helpers.error("password.special");
                }
                return value;
            })
            .messages({
                "string.empty": "Vui lòng nhập mật khẩu!",
                "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
                "any.required": "Vui lòng nhập mật khẩu!",
                "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
                "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
                "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
                "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!"
            }),

        agree: Joi.boolean()
            .valid(true)
            .truthy("on")
            .required()
            .messages({
                "any.only": "Bạn phải đồng ý với các điều khoản và điều kiện!",
                "any.required": "Bạn phải đồng ý với các điều khoản và điều kiện!"
            })
    });
    const {error} = registerSchema.validate(req.body);
    if (error) {
        return res.json({
            code: "error",
            message: error.details[0].message
        });
    }
    next();

}

module.exports.loginPost = (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Vui lòng nhập email của bạn!",
                "string.email": "Email không đúng định dạng!",
                "any.required": "Vui lòng nhập email của bạn!"
            }),

        password: Joi.string()
            .min(8)
            .required()
            .custom((value, helpers) => {
                if (!/[A-Z]/.test(value)) {
                    return helpers.error("password.uppercase");
                }
                if (!/[a-z]/.test(value)) {
                    return helpers.error("password.lowercase");
                }
                if (!/\d/.test(value)) {
                    return helpers.error("password.number");
                }
                if (!/[@$!%*?&]/.test(value)) {
                    return helpers.error("password.special");
                }
                return value;
            })
            .messages({
                "string.empty": "Vui lòng nhập mật khẩu!",
                "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
                "any.required": "Vui lòng nhập mật khẩu!",
                "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
                "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
                "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
                "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!"
            }),
        rememberPassword: Joi.boolean()
    });
    const {error} = loginSchema.validate(req.body);
    if (error) {
        return res.json({
            code: "error",
            message: error.details[0].message
        });
    }
    next();

}