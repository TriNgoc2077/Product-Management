const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/wishlist.controller");

router.get("/", controller.index);
router.post("/add/:productId", controller.addPost);
router.delete("/remove/:productId", controller.remove);

module.exports = router;