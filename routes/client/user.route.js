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


module.exports = router;