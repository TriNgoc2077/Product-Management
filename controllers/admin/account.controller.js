const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");
const Role = require("../../models/role.model");
const { generateRandomString } = require("../../helpers/generate");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    try {
        let find = {};

        const records = await Account.find(find).select("-password -token");

        for (const record of records) {
            const role = await Role.findOne({
                _id: record.role_id,
            });
            record.role = role;
        }
        res.render("admin/pages/accounts/index.pug", {
            titlePage: "Accounts Page",
            records: records
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    try {
        const roles = await Role.find({ deleted: false });


        res.render("admin/pages/accounts/create", {
            pageTitle: "Create new Account",
            roles: roles
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        const emailExist = await Account.findOne({
            email: req.body.email,
            deleted: false
        });
        if (emailExist){
            req.flash("error", "Email already exist !");
            res.redirect("back");
        } else{
            req.body.password = md5(req.body.password);
            req.body.token = generateRandomString(20);
            const record = new Account(req.body);
            await record.save();
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
            req.flash("success", "Create account successfully !");
        }
    } catch(error) {
        console.log("New error: ", error);
    }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        let find = {
            _id: req.params.id,
        };
        if (res.locals.user.id != req.params.id && !res.locals.role.permissions.includes("accounts_edit")) {
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false
        });
        
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Edit Account",
            data: data,
            roles: roles
        });
    } catch(error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const emailExist = await Account.findOne({
            _id: { $ne: id }, //not equal
            email: req.body.email,
            deleted: false
        });

        if (emailExist){
            req.flash("error", "Email already exist !");
        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }
            await Account.updateOne({ _id: id }, req.body);
            // console.log(req.body);
            req.flash("success", "Update successfully !");

        }
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch(error) {
        console.log("New error: ", error);
    }
}


// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        let find = {
            _id: req.params.id,
            deleted: false
        };

        const data = await Account.findOne(find);
        const roleTitle = await Role.findOne({ _id: data.role_id }).select("title");
        data.roleTitle = roleTitle.title;
        res.render("admin/pages/accounts/detail", {
            pageTitle: "Edit Account",
            data: data,
        });
    } catch(error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

//[PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        if (status != "active" && status != "inactive") {
            throw new Error("Status is incorrect !");
        }
        await Account.updateOne({ _id: id }, { status: status });
        req.flash("success", "Change successfully !");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch(error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
} 

//[DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Account.updateOne({ _id: id }, { deleted: true });
        if (res.locals.user.id == id) {
            res.clearCookie("token");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
        req.flash("success", "Delete successfully !");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch(error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
} 

//[DELETE] /admin/accounts/restore/:id
module.exports.restore = async (req, res) => {
    try {
        const id = req.params.id;
        await Account.updateOne({ _id: id }, { deleted: false });

        req.flash("success", "Restore successfully !");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch(error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
} 