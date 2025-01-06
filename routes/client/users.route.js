const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/users.controller.js");

router.get("/not-friend", controller.notFriend);

module.exports = router;