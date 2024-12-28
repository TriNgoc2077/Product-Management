const User = require("../../models/user.model");
module.exports.inforUser = async(req, res, next) => {
    if (req.cookies.userToken) {
        const user = await User.findOne({
            userToken: req.cookies.userToken,
            deleted: false
        }).select("-password -userToken");
        if (user) res.locals.user = user;
    } else {

    }
    next();
}