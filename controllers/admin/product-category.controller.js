const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    //find
    const filterStatus = filterStatusHelpers(req.query);
    
    let find = {};
    if (req.query.status == "deleted") {
        find.deleted = true;
    } else if (req.query.status) {
        find.status = req.query.status;
    } 

    //find
    const objectSearch = searchHelpers(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    const records = await ProductCategory.find(find);

    let newRecords;
    if (!req.query.status) {
        newRecords = createTreeHelper.createTree(records);
    } else if (find.deleted === true ){
        newRecords = records.filter(item => item.deleted === true);
    } else if (find.status === "inactive") {
        newRecords = records.filter(item => item.status === "inactive");
    } else if (find.status === "active") {
        newRecords = records.filter(item => item.status === "active");
    }
    
    res.render("admin/pages/product-category/index.pug", {
        titlePage: "Product Category",
        records: newRecords,
        filterStatus: filterStatus
    });
}

//[PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    console.log(status);
    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    };

    await ProductCategory.updateOne(
        { _id: id }, 
        { 
            status: status,
            $push: { updatedBy: updatedBy }
        }
    );

    req.flash("success", "Update status product category successfully !");
    res.redirect("back");
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

// [GET] /admin/products-category/detail
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    let find = {
        _id: id,
        deleted: false
    };
    const record = await ProductCategory.findOne(find);
    if (record.updatedBy && record.updatedBy.length > 0) {
        for (let update of record.updatedBy) {
            const account = await Account.findOne({ _id: update.account_id }).select("-password -token");
            if (account) {
                update.updater = account.fullName;
            }
        }
    }
    if (record.createdBy) {
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        });
        if (user) {
            record.creator = user.fullName;
        }
    }
    res.render("admin/pages/product-category/detail", {
        titlePage: "Detail product Category",
        category: record
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
    req.body.createdBy = {
        account_id: res.locals.user.id,
    };
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

    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    };
    await ProductCategory.updateOne(
        { _id: id }, 
        { ...req.body, $push: { updatedBy: updatedBy } }
    );
    res.redirect("back");
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne(
        { _id: id }, 
        { 
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deleteAt: new Date()
            } 
        }        
    );
    req.flash("success", `Delete successfully !`);
    res.redirect("back");
}

//[POST] //admin/products/restore/:id
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne(
        { _id: id }, 
        { 
            deleted: false
        }        
    );
    req.flash("success", `Restore successfully !`);
    res.redirect("back");
}

//[PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    };

    if (type == "active") {
        await ProductCategory.updateMany(
            { _id: { $in: ids } }, 
            { status: "active", $push: { updatedBy: updatedBy }}
        );
        req.flash("success", `Update status of ${ids.length} products category successfully !`);
    } else if (type == "inactive") {    
        await ProductCategory.updateMany(
            { _id: { $in: ids } },
            { status: "inactive", $push: { updatedBy: updatedBy }}
        );
        req.flash("success", `Update status of ${ids.length} products category successfully !`);
    } else if (type == "delete-all") {
        await ProductCategory.updateMany(
            { _id: ids },
            { 
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deleteAt: new Date()
                },
                $push: { updatedBy: updatedBy }
            }
        )
        req.flash("success", `Delete ${ids.length} products category successfully !`);
    } else if (type == "change-position") {
        for (const item of ids) {
            let [id, position] = item.split("-");
            position = parseInt(position);
            // console.log(item.split("-"));
            await ProductCategory.updateOne(
                { _id: id },
                { position: position, $push: { updatedBy: updatedBy } }
            );
        }
        req.flash("success", `Change position successfully !`);

    }
    res.redirect("back");
}