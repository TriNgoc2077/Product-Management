const Product = require("../../models/product.model");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    //req.query: (require) query attributes in url, ex:localhost....?status="active"
    
    //filter
    const filterStatus = filterStatusHelpers(req.query);

    const find = {
        deleted: false
    };
    if (req.query.status === "deleted"){
        find.deleted = true;
    } else if (req.query.status) {
        find.status = req.query.status;
    } 
    //find
    const objectSearch = searchHelpers(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    //Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProducts
    );
    //End pagination
    if (find.title !== undefined) {
        objectPagination.skip = 0;
    }
    const products = 
        await Product
            .find(find)
            .sort({ position: "asc" }) // giamdan, asc: tang dan
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

//[PATCH] /admin/products/change-status/:status/:id
//To change the state, necessary to access to database and change data
//. but url can only accessed using get method
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Update status product successfully !");
    res.redirect("back");
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    console.log(ids);
    if (type == "active") {
        await Product.updateMany(
            { _id: { $in: ids } }, 
            { status: "active" }
        );
        req.flash("success", `Update status of ${ids.length} products successfully !`);
    } else if (type == "inactive") {    
        await Product.updateMany(
            { _id: { $in: ids } },
            { status: "inactive" }
        );
        req.flash("success", `Update status of ${ids.length} products successfully !`);
    } else if (type == "delete-all") {
        await Product.updateMany(
            { _id: ids },
            { 
                deleted: true,
                deletedAt: new Date() 
            }
        )
        req.flash("success", `Delete ${ids.length} products successfully !`);
    } else if (type == "change-position") {
        for (const item of ids) {
            let [id, position] = item.split("-");
            position = parseInt(position);
            // console.log(item.split("-"));
            await Product.updateOne(
                { _id: id },
                { position: position }
            );
        }
        req.flash("success", `Change position successfully !`);

    }
    res.redirect("back");
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne(
        { _id: id }, 
        { 
            deleted: true,
            deletedAt: new Date() 
        }        
    );
    req.flash("success", `Delete successfully !`);
    res.redirect("back");
}

//[POST] //admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne(
        { _id: id }, 
        { 
            deleted: false
        }        
    );
    req.flash("success", `Restore successfully !`);
    res.redirect("back");
}

//[GET] //admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add new product",
    });
}
//[POST] //admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const product = new Product(req.body);
    await Product.bulkSave([product]);

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

