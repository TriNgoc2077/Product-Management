module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Please enter the title !");
        res.redirect("back");
        return;
    }
    if (req.body.title.length < 8) {
        req.flash("error", "Enter at least 8 character!");
        res.redirect("back");
        return;
    }
    next();
};