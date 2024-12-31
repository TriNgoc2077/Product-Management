const mongoose = require("mongoose");

const generalSettingSchema = new mongoose.Schema(
	{
		websiteName: String,
		logo: String,
		phone: String,
		email: String,
		address: String, 
		facebook: String,
		instagram: String,
		github: String,
		aboutUs: String, 
		vision: String,
		legalIssues: String
	},
	{
		timestamps: true,
	}
);

const generalSetting = mongoose.model("generalSetting", generalSettingSchema, "general-settings");

module.exports = generalSetting;
