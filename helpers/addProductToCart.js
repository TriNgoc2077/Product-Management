const Cart = require("../models/cart.model");
module.exports.addProduct = async (productId, quantity, cartId) => {
    try {
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
                    quantity: quantity,
                };
        
                await Cart.updateOne(
                    { _id: cartId}, 
                    { $push: { products: objectCart } }
                );
            }
    } catch(error) {
        console.log(error);
    }
}
