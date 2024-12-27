const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controllers/admin/my-account.controller");

router.get("/", controller.index);

router.get("/edit", controller.edit);
router.patch(
    "/edit", 
    upload.single("avatar"),
    uploadCloud.upload,
    controller.editPatch
);

module.exports = router;