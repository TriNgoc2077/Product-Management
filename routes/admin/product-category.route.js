const express = require("express");

const multer = require("multer");
const upload = multer();

const router = express.Router();
const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:status/:id", controller.changeStatus);

router.post(
    "/create", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);
router.delete("/delete/:id", controller.deleteItem);
router.post("/restore/:id", controller.restoreItem);

module.exports = router;