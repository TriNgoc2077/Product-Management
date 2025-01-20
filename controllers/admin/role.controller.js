const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    try {
        let find = {};

        const records = await Role.find(find);

        res.render("admin/pages/roles/index.pug", {
            titlePage: "Roles Page",
            records: records
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    try {
        let find = {
            deleted: false
        }

        const records = await Role.find(find);

        res.render("admin/pages/roles/create.pug", {
            titlePage: "Permission Page"
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    try {
        const record = new Role(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch(error) {
        console.log("New error: ", error);
    }
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = {
            _id: id,
        };
        const record = await Role.findOne(find);

        res.render("admin/pages/roles/edit.pug", {
            titlePage: "Edit Permission",
            data: record
        });
    } catch {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne(
            { _id: req.params.id }, 
            req.body
        );
        req.flash("success", "Update Successfully!");
    } catch(error) {
        console.log(error);
        req.flash("error", "Update Failed !");
    }

    res.redirect("back");
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const thisRole = await Role.findOne({ 
            _id: id,
        });
        if (!thisRole) {
            res.redirect("back");
            return;
        } 
        res.render("admin/pages/roles/detail.pug", {
            titlePage: (thisRole.title ? thisRole.title : "Role"),
            thisRole: thisRole
        });
    } catch(error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, {
            deleted: true
        });
        await Account.updateMany({ role_id: id }, {
            status: "inactive"
        });
        req.flash("success", "Deleted successfully !");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch(error) {    
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } 
}

// [PATCH] /admin/roles/restore/:id
module.exports.restore = async (req, res) => {
    try {
        console.log("ran");
        const id = req.params.id;
        await Role.updateOne({ _id: id }, {
            deleted: false
        });
        req.flash("success", "Restore successfully !");
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    } catch(error) {    
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } 
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        let find = {
            deleted: false
        }

        const records = await Role.find(find);

        res.render("admin/pages/roles/permissions", {
            titlePage: "Permission Page",
            records: records
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        // console.log(req.body.permissions);
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        req.flash("success", "Update successfully !");
        // console.log(permissions);
    } catch {
        req.flash("error", "Update failed !");
    }
    res.redirect("back");
}
