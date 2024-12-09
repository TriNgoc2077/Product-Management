const Product = require("../../models/product.model");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");

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
    //find
    const objectSearch = searchHelpers(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    } 

    //Pagination
    let objectPagination = {
        limitItem: 4,
        currentPage: 1
    };
    if(req.query.page) {
        objectPagination.currentPage = 
            isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
    }
    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts/objectPagination.limitItem);
    objectPagination.totalPage = totalPage;
    
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    //End pagination

    const products = 
        await Product
            .find(find)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

    res.render("admin/pages/products/index.pug", {
        titlePage: "Product List",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}