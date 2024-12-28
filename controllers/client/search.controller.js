const Product = require("../../models/product.model");
const ProductHelper = require("../../helpers/product");
// [GET] /searchs
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    let newProducts = [];
    if (keyword) {
        const keywordRegex = new RegExp(keyword, "i");
        const products = await Product.find({
            deleted: false,
            status: "active",
            title: keywordRegex
        });
        newProducts = ProductHelper.newPrice(products);
    }
    res.render("client/pages/search/index.pug", {
        titlePage: "Search Result",
        keyword: keyword,
        products: newProducts
    });
}