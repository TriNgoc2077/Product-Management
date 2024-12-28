const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
//[POST] /checkout
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({ _id: cartId });
        if (cart.products.length) {
            for (let item of cart.products) {
                let productInfo = await Product.findOne(
                    { _id: item.product_id }
                );
                productInfo = productHelper.newPriceOneProduct(productInfo);
                item.productInfo = productInfo;
                item.totalPrice = item.quantity * productInfo.newPrice;
            }
        }  
        cart.totalAmount = cart.products.reduce((sum, item) => sum + item.totalPrice,0);

        res.render("client/pages/checkout/index", {
            titlePage: "Checkout",
            cart: cart
        });
    } catch(error) {
        res.redirect("back");
    }
}