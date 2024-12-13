const express = require("express");
const multer = require("multer");

const router = express.Router();
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
//:status: dynamic data
router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.delete("/restore/:id", controller.restoreItem);

router.get("/create", controller.create);

router.post(
    "/create", 
    upload.single("thumbnail"), 
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"),
    validate.createPost,
    controller.editPatch
);

module.exports = router;