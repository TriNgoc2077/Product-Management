const User = require("../../models/user.model");
const md5 = require("md5");

//[GET] /user/register
module.exports.register = async (req, res) => {
    try {
        res.render("client/pages/user/register", {
            titlePage: "Register"
        });
    } catch(error) {

    }
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        console.log(req.body);
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existEmail) {
            req.flash("error", "Email already exist !");
            res.redirect("back");
            return;
        }
        req.body.password = md5(req.body.password);

        const user = new User(req.body);
        await user.save();
        res.cookie("userToken", user.userToken);
        res.redirect("/");
    } catch(error) {

    }
};

//[GET] /user/login
module.exports.login = async (req, res) => {
    try {
        res.render("client/pages/user/login", {
            titlePage: "Login"
        });
    } catch(error) {

    }
};

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await User.findOne({
            email: email,
            deleted: false
        });
        if (!user) {
            req.flash("error", "Email does not exist !");
            res.redirect("back");
            return;
        }
        if (md5(password) != user.password) { 
            req.flash("error", "Password is incorrect !");
            res.redirect("back");
            return;
        }
        if (user.status == "inactive") { 
            req.flash("error", "Account is locked !");
            res.redirect("back");
            return;
        }
        if (user.deleted == "true") { 
            req.flash("error", "Account is deleted !");
            res.redirect("back");
            return;
        }
        res.cookie("userToken", user.userToken);
        res.redirect("/");
    } catch(error) {

    }
};

