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