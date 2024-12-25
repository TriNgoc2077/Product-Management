module.exports.createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Please enter the name !");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Please enter the email !");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Please enter the password !");
        res.redirect("back");
        return;
    }
    next();
};

module.exports.editPatch = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Please enter the name !");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Please enter the email !");
        res.redirect("back");
        return;
    }
    next();
};