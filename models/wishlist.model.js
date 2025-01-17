const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            { 
                product_id: String,
            }
        ],
    },
    {
        timestamps: true
    }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema, "wishlist");

module.exports = Wishlist;