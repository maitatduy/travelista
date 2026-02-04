const Joi = require("joi");

module.exports.createPost = (req, res, next) => {
    const tourSchema = Joi.object({
        fullName: Joi.string().required().messages({
            "string.empty": "Vui lòng nhập tên tour!",
            "any.required": "Vui lòng nhập tên tour!",
        }),
    });
    const { error } = tourSchema.validate(req.body);
    if (error) {
        return res.json({
            code: "error",
            message: error.details[0].message,
        });
    }
    next();
};
