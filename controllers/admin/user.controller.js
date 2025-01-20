const User = require("../../models/user.model");
const systemConfig = require("../../config/system");
const filterStatusHelpers = require("../../helpers/filterStatus");

// [GET] /admin/users
module.exports.index = async (req, res) => {
    try {
        const filterStatus = filterStatusHelpers(req.query);
        let find = {};
        if (req.query.status === "deleted") {
            find.deleted = true
        } else if (req.query.status) {
            find.status = req.query.status
        }
        const records = await User.find(find).select("-password -userToken");
        res.render("admin/pages/users/index.pug", {
            titlePage: "User Account Page",
            filterStatus: filterStatus,
            records: records
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}

// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        if (!user) {
            throw new Error("Not found");
        }
        res.render("admin/pages/users/detail.pug", {
            titlePage: "User Account",
            data: user
        });
    } catch(error) {
        console.log(error);
        res.redirect("back");
    }
}

// [GET] /admin/users/changeStatus/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        if (status != "active" && status != "inactive") {
            throw new Error("Status is incorrect fomat !");
        }

        await User.updateOne({ _id: id }, { status: status });
        req.flash("success", "Change status successfully !");
        res.redirect("back");
    } catch(error) {
        console.log(error);
        res.redirect("back");
    }
}

// [GET] /admin/users/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await User.updateOne({ _id: id }, { deleted: true });
        req.flash("success", "Delete successfully !");
        res.redirect("back");
    } catch(error) {
        console.log(error);
        res.redirect("back");
    }
}

// [GET] /admin/users/restore/:id
module.exports.restore = async (req, res) => {
    try {
        const id = req.params.id;
        await User.updateOne({ _id: id }, { deleted: false });
        req.flash("success", "Restore successfully !");
        res.redirect("back");
    } catch(error) {
        console.log(error);
        res.redirect("back");
    }
}