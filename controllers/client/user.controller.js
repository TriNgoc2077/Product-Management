const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
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

//[GET] /user/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie("userToken");
        req.flash("success", "Log out successfully !");
        res.redirect("/");

    } catch(error) {
        console.log(error);
    }
};

//[GET] /user/password/forgot 
module.exports.forgotPassword = async (req, res) => {
    try {
        res.render("client/pages/user/forgot-password", {
            titlePage: "Forgot Password"
        });
    } catch(error) {
        console.log(error);
    }
};

//[POST] /user/password/forgot 
module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({
            email: email,
            deleted: false
        });
        if (!email) {
            req.flash("error", "Email does not exist !");
            res.redirect("back");
            return;
        }
        //generate otp
        const otp = generateHelper.generateRandomNumber(6);
        const objectForgotPassword = {
            email: email,
            otp: "",
            expireAt: Date.now()
        };

        objectForgotPassword.otp = otp;
        console.log(objectForgotPassword);
        const request = new ForgotPassword(objectForgotPassword);
        await request.save();
        //send mail

        res.redirect(`/user/password/otp?email=${email}`);
    } catch(error) {
        console.log(error);
    }
};

//[GET] /user/password/otp 
module.exports.otpPassword = async (req, res) => {
    try {
        const email = req.query.email;
        res.render("client/pages/user/otp-password", {
            titlePage: "Enter OTP",
            email: email 
        });
    } catch(error) {
        console.log(error);
    }
};

//[POST] /user/password/otp 
module.exports.otpPasswordPost = async (req, res) => {
    try {
        // console.log(req.body); //from form
        const email = req.body.email;
        let otp = "";
        for (let i of [1, 2, 3, 4, 5, 6]){
            const index = `otp${i}`;
            otp += req.body[index];
        }
        const request = await ForgotPassword.findOne({
            email: email,
            otp: otp
        });
        
        console.log(request);
        
        
        if (!request) {
            req.flash("error", "OTP is invalid !");
            res.redirect("back");
            return;
        } else {
            const userToken = await User.findOne({
                email: email
            }).select("userToken");

            res.cookie("userToken", userToken);
            res.redirect("/user/password/reset");
        }
    } catch(error) {
        console.log(error);
    }
};