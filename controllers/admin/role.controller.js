const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/index.pug", {
        titlePage: "Permission Page",
        records: records
    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/create.pug", {
        titlePage: "Permission Page"
    });
}
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}