// [GET] /products

const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: "false"
    });

    const newProducts = products.map(item => {
        item.priceNew = parseInt(item.price * (1 - item.discountPercentage * 0.01)); 
        return item;
    });

    res.render("client/pages/products/index.pug", {
        titlePage: "Product",
        products: newProducts
    });
}