const Cart = require("../../models/cart.model");
//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);
        const thumbnail = req.body.thumbnail;

        const cart = await Cart.findOne({ _id: cartId });
        let existProductInCart = cart.products.find(item => item.product_id == productId);
        if (existProductInCart) {
            const newQuantity = quantity + existProductInCart.quantity;
            await Cart.updateOne(
                { 
                    _id: cartId,
                    'products.product_id': productId 
                }, 
                { '$set': {'products.$.quantity': newQuantity} }
            );
        }
        else {
            const objectCart = {
                product_id: productId,
                thumbnail: thumbnail,
                quantity: quantity,
            };
    
            await Cart.updateOne(
                { _id: cartId}, 
                { $push: { products: objectCart } }
            );
        }
        
        req.flash("success", "Added product to cart !");
        res.redirect("back");
    } catch {
        req.flash("error", "Added failed !");
        res.redirect("back");
    }
}