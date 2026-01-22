const Joi = require("joi");

module.exports.createPost = (req, res, next) => {
    const categorySchema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty": "Vui lòng nhập tên danh mục"
            }),
        parent: Joi.string().allow(""),
        position: Joi.string().allow(""),
        status: Joi.string().allow(""),
        avatar: Joi.string().allow(""),
        description: Joi.string().allow(""),
    });
    const {error} = categorySchema.validate(req.body);
    if (error) {
        return res.json({
            code: "error",
            message: error.details[0].message
        });
    }
    next();
}