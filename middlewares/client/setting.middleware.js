const generalSetting = require("../../models/general-settings.model");
module.exports.generalSetting = async (req, res, next) => {
    try {
        const record = await generalSetting.findOne({});
        res.locals.generalSetting = record;
    } catch {

    }
    next();
}