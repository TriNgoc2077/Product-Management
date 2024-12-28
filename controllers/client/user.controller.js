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