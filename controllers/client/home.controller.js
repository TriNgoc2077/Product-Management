const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [GET] /
module.exports.index = async (req, res) => {
    const featuredProducts = await Product.find(
        { 
            deleted: false,
            featured: "1",
            status: "active"
        }
    );
    const newProducts = productHelper.newPrice(featuredProducts);
    res.render("client/pages/home/index.pug", {
        titlePage: "Home",
        featuredProducts: newProducts
    });
}