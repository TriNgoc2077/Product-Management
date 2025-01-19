const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
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


//[POST] /checkout/order
module.exports.order = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const inforUser = req.body;
        const cart = await Cart.findOne(
            { _id: cartId },
        );
        const products = [];
        for (let product of cart.products) {
            const objectProduct = {
                product_id: product.product_id,
                price: 0,
                discountPercentage: 0,
                quantity: product.quantity,
            }
            const productInfo = await Product.findOne({
                _id: product.product_id
            });
            objectProduct.price = productInfo.price;
            objectProduct.discountPercentage = productInfo.discountPercentage;
            objectProduct.title = productInfo.title;
            objectProduct.thumbnail = productInfo.thumbnail;
            products.push(objectProduct);
        }

        const objectOrder = {
            cart_id: cartId,
            userInfo: inforUser,
            products: products,
        }
        const order = new Order(objectOrder);
        await order.save();
        await Cart.updateOne(
            { _id: cartId },
            { products: [] }
        )
        res.redirect(`/checkout/success/${order._id}`);
    } catch(error) {
        req.flash("error", "Order Failed !");
        console.log(error);
        res.redirect("back");
    }
}

//[GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.orderId });
        for (let product of order.products) {
            const productInfo = await Product.findOne(
                { _id: product.product_id }
            ).select("title thumbnail stock");
            product.productInfo = productInfo;
            
            product = productHelper.newPriceOneProduct(product);
            product.totalPrice = product.newPrice * product.quantity;

            await Product.updateOne({ _id: product.product_id }, {
                stock: (productInfo.stock - product.quantity)
            });
        }
        order.totalAmount = order.products.reduce((sum, item) => sum + item.totalPrice,0);
        
        let featuredProducts = await Product.find({
            featured: "1"
        }).limit(8);
        featuredProducts = productHelper.newPrice(featuredProducts);
        res.render("client/pages/checkout/success", {
            titlePage: "Order successfully !",
            order: order,
            featuredProducts: featuredProducts
        });
    } catch(error) {
        console.log(error);
        res.redirect("back");
    }
}