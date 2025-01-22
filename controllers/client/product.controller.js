const Product = require('../../models/product.model');
const productHelper = require("../../helpers/product");
const searchHelpers = require("../../helpers/search");
const ProductCategory = require("../../models/product-category.model");
const Order = require("../../models/order.model");
const checkReviewHelpers = require("../../helpers/checkReview");
const { all } = require('../../routes/client/product.route');
const productCategoryHelper = require("../../helpers/productCategory");
const { body } = require("express-validator");
// [GET] /products

module.exports.index = async (req, res) => {
    try {
        let find = {
            status: "active",
            deleted: "false"
        };
        //find
        const objectSearch = searchHelpers(req.query);

        if (objectSearch.regex) {
            find.title = objectSearch.regex;
        }
        const products = await Product.find(find).sort({ position: "asc" });
        
        const newProducts = productHelper.newPrice(products);
        
        res.render("client/pages/products/index.pug", {
            titlePage: "Our products",
            products: newProducts,
            keyword: objectSearch.keyword,
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct
        };

        let product = await Product.findOne(find);
        //category
        if (product.product_category_id) {
            let listCategory = [];
            let category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            if (category) {
                listCategory.unshift(category);
                while (category.parent_id) {
                    category = await ProductCategory.findOne({
                        _id: category.parent_id,
                        status: "active",
                        deleted: false
                    });
                    if (category) listCategory.unshift(category);
                    else break;
                }
            }
            product.category = listCategory;
        }
        productHelper.newPriceOneProduct(product);
        //review
        const purchasedProducts = await Order.find({ cart_id: req.cookies.cartId, status: "completed" }).select("products");
        var canReview = false;
        for (let order of purchasedProducts) {
            canReview = checkReviewHelpers.checkReview(order, product);
            if (canReview) {
                break;
            }
        }
        if (!product.review) {
            product.review = [];
        }
        res.render("client/pages/products/detail.pug", {
            titlePage: product.title,
            product: product,
            canReview: canReview
        });
    } catch(error) {
        console.log(error);
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

//[POST] /products/review/:id
module.exports.review = [
    body('review').trim() .escape(), async (req, res) => {
        try {
            const content = req.body.review;
            // const user = res.locals.user;
            const objectUpdate = {
                userAvatar: res.locals.user.avatar,
                userFullname: res.locals.user.fullName,
                content: content
            };
            await Product.updateOne(
                { _id: req.params.id },
                { $push: { review: objectUpdate } }
            );
            req.flash("success", "Review successfully !");
            res.redirect(req.get("Referrer") || "/");
        } catch(error) {
            console.log(error);
            return res.redirect(`/products`);
        }
    }
];