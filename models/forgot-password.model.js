const mongoose = require("mongoose");
const {Schema} = mongoose;

const schema = new Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 0
        }
    },
    {
        timestamps: true, // Tự động sinh ra thêm trường createdAt và updatedAt
    }
);

const ForgotPassword = mongoose.model("ForgotPassword", schema, "forgot-password");

module.exports = ForgotPassword;