// [GET] /products

const Product = require('../../models/product.model');

module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: "false"
    }).sort({ position: "asc" });

    const newProducts = products.map(item => {
        item.priceNew = parseInt(item.price * (1 - item.discountPercentage * 0.01)); 
        return item;
    });

    res.render("client/pages/products/index.pug", {
        titlePage: "Product",
        products: newProducts
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    console.log(req.params.slug);
    try {
        const find = {
            deleted: false,
            slug: req.params.slug
        };

        const product = await Product.findOne(find);
        console.log(product);

        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch(error) {
        res.redirect(`/products`);
    }
}

