const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Wishlist = require("../../models/wishlist.model");
const Order = require("../../models/order.model");
const generateHelper = require("../../helpers/generate");
const productHelper = require("../../helpers/product");
const Cart = require("../../models/cart.model");
const md5 = require("md5");
const sendMailHelper = require("../../helpers/sendMail");
//[GET] /user/register
module.exports.register = async (req, res) => {
	try {
		res.render("client/pages/user/register", {
			titlePage: "Register",
		});
	} catch (error) {
		res.redirect("back");
	}
};
//[POST] /user/verify
module.exports.verify = async (req, res) => {
	try {
		const existEmail = await User.findOne({
			email: req.body.email,
			deleted: false,
		});
		if (existEmail) {
			req.flash("error", "Email already exist !");
			res.redirect("back");
			return;
		}
		const data = req.body;
		//generate otp
		const otp = generateHelper.generateRandomNumber(6);
		const objectForgotPassword = {
			email: data.email,
			otp: "",
			expireAt: Date.now(),
		};

		objectForgotPassword.otp = otp;
		const request = new ForgotPassword(objectForgotPassword);
		await request.save();
		//send mail
		const subject = "Your OTP";
		sendMailHelper.sendMail(data.email, subject, data, otp);

		res.render("client/pages/user/verify", {
			titlePage: "Verify",
			data: data
		});
	} catch (error) {
		res.redirect("back");
	}
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
	try {
		const email = req.body.email;
		let otp = "";
		for (let i of [1, 2, 3, 4, 5, 6]) {
			const index = `otp${i}`;
			otp += req.body[index];
		}
		const request = await ForgotPassword.findOne({
			email: email,
			otp: otp,
		});

		if (!request) {
			req.flash("error", "OTP is invalid !");
			res.redirect("back");
			return;
		} else {
			req.body.password = md5(req.body.password);
			//cart
			const cart = new Cart();
			await cart.save();
			const expires = 1000 * 3600 * 24 * 365;
			res.cookie("cartId", cart.id, {
				expires: new Date(Date.now() + expires)
			});
			res.locals.miniCart = cart;
			req.body.cartId = cart.id;
			//wishlist
			const wishlist = new Wishlist();
			await wishlist.save();
			res.cookie("wishlistId", wishlist.id, {
				expires: new Date(Date.now() + expires)
			});
			res.locals.miniWishlist = wishlist;
			req.body.wishlistId = wishlist.id;

			const user = new User(req.body);
			await user.save();
			res.cookie("userToken", user.userToken);
			res.redirect("/");
		}
	} catch (error) {
		console.log(error);
		res.redirect("back");
	}
};

//[GET] /user/login
module.exports.login = async (req, res) => {
	try {
		res.render("client/pages/user/login", {
			titlePage: "Login",
		});
	} catch (error) {}
};

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		const user = await User.findOne({
			email: email,
			deleted: false,
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
		if (!user.cartId) {
			const cart = new Cart();
			await cart.save();
			user.cartId = cart.id;
			await user.save();
		}
		if (!user.wishlistId) {
			const wishlist = new Wishlist();
			await wishlist.save();
			user.wishlistId = wishlist.id;
			await user.save();
		}
		// save user_id to cart
		const expires = 1000 * 3600 * 24 * 365;
        res.cookie("cartId", user.cartId, {
            expires: new Date(Date.now() + expires)
        });
		res.cookie("wishlistId", user.wishlistId, {
			expires: new Date(Date.now() + expires)
		});

		await User.updateOne({ _id: user.id }, { online: "online" });

		//socket 
		_io.once('connection', (socket) => {
			socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
		});
		res.redirect("/");
	} catch (error) {
		console.log(error);
		res.redirect("back");
	}
};

//[GET] /user/logout
module.exports.logout = async (req, res) => {
	try {
		await User.updateOne({ _id: res.locals.user.id }, { online: "offline" });
		//socket 
		_io.once('connection', (socket) => {
			socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", res.locals.user.id);
		});
		res.clearCookie("userToken");
		res.clearCookie("cartId");
		res.clearCookie("wishlistId");
		req.flash("success", "Log out successfully !");
		res.redirect("/");
	} catch (error) {
		console.log(error);
	}
};

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
	try {
		res.render("client/pages/user/forgot-password", {
			titlePage: "Forgot Password",
		});
	} catch (error) {
		console.log(error);
	}
};

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({
			email: email,
			deleted: false,
		}).select("-password -userToken");
		if (!user) {
			req.flash("error", "Email does not exist !");
			res.redirect("back");
			return;
		}
		//generate otp
		const otp = generateHelper.generateRandomNumber(6);
		const objectForgotPassword = {
			email: email,
			otp: "",
			expireAt: Date.now(),
		};

		objectForgotPassword.otp = otp;
		console.log(objectForgotPassword);
		const request = new ForgotPassword(objectForgotPassword);
		await request.save();

		//send mail
		const subject = "Your OTP";
		sendMailHelper.sendMail(email, subject, user, otp);

		res.redirect(`/user/password/otp?email=${email}`);
	} catch (error) {
		console.log(error);
	}
};

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
	try {
		const email = req.query.email;
		res.render("client/pages/user/otp-password", {
			titlePage: "Enter OTP",
			email: email,
		});
	} catch (error) {
		console.log(error);
	}
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
	try {
		// console.log(req.body); //from form
		const email = req.body.email;
		let otp = "";
		for (let i of [1, 2, 3, 4, 5, 6]) {
			const index = `otp${i}`;
			otp += req.body[index];
		}
		const request = await ForgotPassword.findOne({
			email: email,
			otp: otp,
		});

		if (!request) {
			req.flash("error", "OTP is invalid !");
			res.redirect("back");
			return;
		} else {
			const userToken = await User.findOne({
				email: email,
			}).select("userToken");

			res.cookie("userToken", userToken);
			res.redirect("/user/password/reset");
		}
	} catch (error) {
		console.log(error);
	}
};

//[GET] /user/password/reset
module.exports.passwordReset = async (req, res) => {
	try {
		res.render("client/pages/user/reset-password", {
			titlePage: "Reset password",
		});
	} catch (error) {
		console.log(error);
	}
};

//[POST] /user/password/reset
module.exports.passwordResetPost = async (req, res) => {
	try {
		const password = md5(req.body.newPassword);
		const userToken = req.cookies.userToken;
		await User.updateOne(
			{ userToken: userToken.userToken },
			{ password: password }
		);
		req.flash("success", "Update password successfully ! Login now");
		res.redirect("/user/login");
	} catch (error) {
		console.log(error);
	}
};

//[GET] /user/profile
module.exports.profile = async (req, res) => {
	try {
		const userId = res.locals.user.id;
		const user = await User.findOne({ _id: userId }).select("-password -userToken");
		res.render("client/pages/user/profile", {
			titlePage: "Profile",
			userInfor: user
		});
	} catch (error) {
	    console.log(error);
	}
};

//[PATCH] /user/profile/edit
module.exports.editProfile = async (req, res) => {
	try {
		const userId = res.locals.user.id;
		delete req.body.email;
		await User.updateOne(
			{ _id: userId},
			{ $set: req.body }
		);
		req.flash("success", "Update successfully !");
		res.redirect(req.get("Referrer") || "/");
	} catch (error) {
	    console.log(error);
	}
};

//[GET] /user/orders
module.exports.orders = async (req, res) => {
	try {
		const cartId = req.cookies.cartId;
		const orders = await Order.find({ cart_id: cartId });
		for (let order of orders) {
			order.products = productHelper.newPrice(order.products);
			order.totalProducts = order.products.reduce((acc, item) => acc + item.priceNew, 0);
			order.totalAmount = order.totalProducts + (order.shipping ? order.shipping : 0);
		}

		res.render("client/pages/orders/index", {
			titlePage: "Profile",
			orders: orders
		});
	} catch (error) {
	    console.log(error);
	}
};
//[GET] /user/orders/detail/:id
module.exports.orderDetail = async (req, res) => {
	try {
		const orderId = req.params.orderId;
		const order = await Order.findOne({ _id: orderId });
		order.products = productHelper.newPrice(order.products);
		order.totalProducts = order.products.reduce((acc, item) => acc + item.priceNew, 0);
		order.totalAmount = order.totalProducts + (order.shipping ? order.shipping : 0);
		res.render("client/pages/orders/detail", {
			titlePage: "Profile",
			order: order
		});
	} catch (error) {
	    console.log(error);
	}
};

//[GET] /user/orders/cancel/:id
module.exports.cancelOrder = async (req, res) => {
	try {
		const orderId = req.params.orderId;
		await Order.updateOne(
			{ _id: orderId },
			{ status: "canceled" }
		);
		req.flash("success", "Order is canceled");
		// res.redirect(req.get("Referrer") || "/");
		res.status(200).send({ message: "Order cancelled successfully" });
	} catch (error) {
	    console.log(error);
		res.status(500).send({ error: "Failed to cancel order" });
	}
};