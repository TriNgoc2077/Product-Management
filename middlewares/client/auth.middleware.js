const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
	// console.log(req.cookies);
	if (!req.cookies.userToken) {
		res.redirect(`/user/login`);
	} else {
		const userAuth = await User.findOne({ userToken: req.cookies.userToken }).select("-password -token");
		if (!userAuth) {
			res.redirect(`/user/login`);
			return;
		} else {
			next();
		}
	}
};
