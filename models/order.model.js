const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        fullName: String,
        phone: String,
        note: String,
        items: Array,
        subTotal: Number,
        total: Number,
        paymentMethod: String,
        paymentStatus: String,
        status: String,
        updatedBy: String,
        orderCode: String,
        discount: {
            type: Number,
            default: 0,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedBy: String,
        deletedAt: Date,
    },
    {
        timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
    },
);

const Order = mongoose.model("Order", schema, "orders");

module.exports = Order;
