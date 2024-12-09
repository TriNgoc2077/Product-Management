const { find } = require("../models/product.model");

module.exports = (query) => {
    let objectSearch = {
        keyword: ""
    }

    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch.keyword, "i"); 
        //find products with keyword, i: doesn't distinguish upper, lower case
        objectSearch.regex = regex;
    } 
    return objectSearch;
}