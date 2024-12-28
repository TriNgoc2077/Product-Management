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

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    console.log(req.params.slugProduct);
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct
        };

        let product = await Product.findOne(find);

        if (product.product_category_id) {
            let listCategory = [];
            let category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            listCategory.unshift(category);
            while (category.parent_id) {
                category = await ProductCategory.findOne({
                    _id: category.parent_id,
                    status: "active",
                    deleted: false
                });
                listCategory.unshift(category);
            }
            product.category = listCategory;
        }
        productHelper.newPriceOneProduct(product);
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