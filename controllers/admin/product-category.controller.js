const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.createTree(records);

    // console.log(newRecords);

    res.render("admin/pages/product-category/index.pug", {
        titlePage: "Product Category",
        records: newRecords
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.createTree(records);

    // console.log(newRecords);

    res.render("admin/pages/product-category/create", {
        titlePage: "Create product Category",
        records: newRecords
    });
}
//[POST] //admin/product-categody/create
module.exports.createPost = async (req, res) => {
    // console.log(req.body);
    if (req.body.position == ""){
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await ProductCategory.bulkSave([record]);
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const records = await ProductCategory.find({ deleted: false });
        const newRecords = createTreeHelper.createTree(records);

        const record = await ProductCategory.findOne({ 
            _id: id, 
            deleted: false 
        });
        res.render("admin/pages/product-category/edit", {
            titlePage: "Edit product Category",
            data: record,
            records: newRecords
        });
    } catch(err) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
    
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne(
        { _id: id }, 
        req.body
    );
    res.redirect("back");
}