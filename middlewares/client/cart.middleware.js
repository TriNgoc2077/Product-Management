const Cart = require("../../models/cart.model");
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