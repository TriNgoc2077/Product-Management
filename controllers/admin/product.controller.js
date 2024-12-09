const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        }
    ];

    if(req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active";
    } else {
        filterStatus[0].class = "active";
    }

    const find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    } 
    //url: localhost:3000/admin/products?status=active

    const products = await Product.find(find);

    res.render("admin/pages/products/index.pug", {
        titlePage: "Product List",
        products: products,
        filterStatus: filterStatus
    });
}