const express = require("express");
const router = express.Router();

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

router.get("/password/reset", controller.passwordReset);
router.post(
	"/password/reset",
	validates.resetPasswordPost,
	controller.passwordResetPost
);

router.get("/profile", authMiddleware.requireAuth, controller.profile);

module.exports = router;
