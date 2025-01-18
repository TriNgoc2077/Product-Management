const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
const addProductHelper = require("../../helpers/addProductToCart");
//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        if (!cartId) {
            res.redirect("/user/login");
            return;
        }
        const productId = req.params.productId;
        const quantity = (req.body.quantity ? parseInt(req.body.quantity): 1);

        await addProductHelper.addProduct(productId, quantity, cartId);
        
        req.flash("success", "Added product to cart !");
        res.redirect("back");

    } catch(error) {
        req.flash("error", "Added failed !");
        res.redirect("back");
    }
}

//[GET] /cart/
module.exports.cart = async (req, res) => {
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

        let featuredProducts = await Product.find({
            featured: "1"
        }).limit(8);
        featuredProducts = productHelper.newPrice(featuredProducts);

        res.render("client/pages/cart/index.pug", {
            titlePage: "Cart",
            cart: cart,
            featuredProducts: featuredProducts
        });
    } catch(error) {

    }
}

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    try {
        const productId = req.params.productId;
        const cartId = req.cookies.cartId;
        await Cart.updateOne(
            { _id: cartId },
            { '$pull': { products: { 'product_id': productId } } }
        );
        req.flash("success", "Removed !");
        res.redirect("back");
    } catch(error) {

    }
}

//[GET] /cart/update/:productId/:productQuantity
module.exports.update = async (req, res) => {
    try {
        const productId = req.params.productId;
        const cartId = req.cookies.cartId;
        const quantity = req.params.productQuantity;

        await Cart.updateOne( 
            { _id: cartId, 'products.product_id': productId },
            { 'products.$.quantity': quantity }
        );
        res.redirect("back");
    } catch(error) {

    }
}