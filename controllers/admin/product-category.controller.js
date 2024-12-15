const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await ProductCategory.find(find);
    
    res.render("admin/pages/product-category/index.pug", {
        titlePage: "Product Category",
        records: records
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    function createTree(arr, parentId = "") {
        const tree = [];
        arr.forEach((item) => {
            if (item.parent_id == parentId) {
                const newItem = item;
                // console.log(item._id.toString());
                const children = createTree(arr, item._id);
                if (children.length > 0) {
                    newItem.children = children;
                }
                console.log(newItem);
                tree.push(newItem);
            }
            
        });
        return tree;
    }
    
    const records = await ProductCategory.find(find);
    const newRecords = createTree(records);

    // console.log(newRecords);



    res.render("admin/pages/product-category/create", {
        titlePage: "Create product Category",
        records: records
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