module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Please enter full name !");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Please enter email !");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Please enter password !");
        res.redirect("back");
        return;
    }
    next();
};

module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Please enter email !");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Please enter password !");
        res.redirect("back");
        return;
    }
    next();
};

module.exports.forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Please enter email !");
        res.redirect("back");
        return;
    }
    next();
};

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.newPassword) {
        req.flash("error", "Please enter new password !");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Please confirm password !");
        res.redirect("back");
        return;
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        req.flash("error", "New password and confirm password do not match !");
        res.redirect("back");
        return;
    }
    next();
};