const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.category = async (req, res, next) => {
    let find = {
        deleted: false
    };
    const productsCategory = await ProductCategory.find(find);

    const newProductsCategory = createTreeHelper.createTree(productsCategory);
     
    res.locals.layoutProductsCategory = newProductsCategory;
    next();
}