const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validates = require("../../validates/client/user.validate");
router.get("/register", controller.register);
router.post(
    "/register", 
    validates.registerPost,
    controller.registerPost
);
router.get("/login", controller.login);
router.post(
    "/login", 
    validates.loginPost,
    controller.loginPost
);

router.get("/logout", controller.logout);

module.exports = router;