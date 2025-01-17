const Cart = require("../../models/cart.model");
const Wishlist = require("../../models/wishlist.model");
module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {

    } else {
        const cart = await Cart.findOne(
            { _id: req.cookies.cartId },
        );
        res.locals.miniCart = cart;
    }
    next();
}

module.exports.wishlistId = async (req, res, next) => {
    if (!req.cookies.wishlistId) {

    } else {
        const wishlist = await Wishlist.findOne(
            { _id: req.cookies.wishlistId },
        );
        res.locals.miniWishlist = wishlist;
    }
    next();
}