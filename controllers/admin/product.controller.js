const Product = require("../../models/product.model");

const filterStatusHelpers = require("../../helpers/filterStatus");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    //req.query: (require) query attributes in url, ex:localhost....?status="active"
    //filter
    const filterStatus = filterStatusHelpers(req.query);

    const find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    } 
    let keyword = "";

    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i"); 
        //find products with keyword, i: doesn't distinguish upper, lower case
        find.title = regex;
    } 

    const products = await Product.find(find);

    res.render("admin/pages/products/index.pug", {
        titlePage: "Product List",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
}