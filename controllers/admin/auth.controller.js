const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

//[GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login.pug", {
        pageTitle: "Login"
    });
}

//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Email does not exist !");
        res.redirect("back");
        return;
    }
    if (md5(password) != user.password){
        req.flash("error", "Password is incorrect !");
        res.redirect("back");
        return;
    } else if (user.status == "inactive"){
        req.flash("error", "This account is locked !");
        res.redirect("back");
        return;
    }
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}