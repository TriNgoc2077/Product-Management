const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controllers/client/user.controller");
const validates = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");
router.get("/register", controller.register);
router.post("/verify", controller.verify);
router.post("/register", validates.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", validates.loginPost, controller.loginPost);

router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);

router.post(
	"/password/forgot",
	validates.forgotPasswordPost,
	controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", authMiddleware.requireAuth,  controller.passwordReset);
router.post(
	"/password/reset",
	authMiddleware.requireAuth, 
	validates.resetPasswordPost,
	controller.passwordResetPost
);

router.get("/profile", authMiddleware.requireAuth, controller.profile);
router.patch(
	"/profile/edit", 
	authMiddleware.requireAuth,
	upload.single("avatar"),
	uploadCloud.upload,
	controller.editProfile
);
router.get("/orders", authMiddleware.requireAuth, controller.orders);
router.get("/orders/detail/:orderId", authMiddleware.requireAuth, controller.orderDetail);
router.post("/orders/cancel/:orderId", authMiddleware.requireAuth, controller.cancelOrder);

module.exports = router;
