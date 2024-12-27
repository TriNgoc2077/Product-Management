const Product = require('../../models/product.model');
const productHelper = require("../../helpers/product");
const ProductCategory = require("../../models/product-category.model");
const { all } = require('../../routes/client/product.route');
const productCategoryHelper = require("../../helpers/productCategory");
// [GET] /products

module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: "false"
    }).sort({ position: "asc" });

    const newProducts = productHelper.newPrice(products);
    
    res.render("client/pages/products/index.pug", {
        titlePage: "Our products",
        products: newProducts,
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

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            deleted: false
        });
        

        const listSubCategory = await productCategoryHelper.getSubCategory(category.id);

        const listSubCategoryId = listSubCategory.map(item => {
            return item.id;
        });

        const products = await Product.find({
            product_category_id: { $in: [category.id, ...listSubCategoryId] },
            deleted: false
        }).sort({ position: "desc" });

        // console.log(products);
        const newProducts = productHelper.newPrice(products);
        res.render("client/pages/products/index.pug", {
            titlePage: category.title,
            products: newProducts,
        });
    } catch(error) {
        res.redirect(`/products`);
    }
}