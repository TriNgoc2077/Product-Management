const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

//[GET] /admin/my-account
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Profile"
    });
}

//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Edit Profile"
    });
}
//[PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    try {
        const id = res.locals.user.id;
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
        res.redirect("back");
    } catch {
        res.flash("error", "Update Failed !");
    }
}