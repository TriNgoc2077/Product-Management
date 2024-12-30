const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
	// console.log(req.cookies);
	if (!req.cookies.token) {
		res.redirect(`/user/login`);
	} else {
		const user = await User.findOne({
			userToken: req.cookies.userToken,
		}).select("-password -token");
		if (!user) {
			res.redirect(`user/login`);
			return;
		} else {
			next();
		}
	}
};
