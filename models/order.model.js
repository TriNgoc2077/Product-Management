const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        cart_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String,
            notes: String,
        },
        status: String,
        shipping: Number,
        createAt: {
            type: Date,
            default: Date.now
        },
        products: [
            {
                product_id: String,
                title: String,
                thumbnail: String,
                price: Number,
                discountPercentage: Number,
                quantity: Number,
            }
        ],
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema, "order");

module.exports = Order;