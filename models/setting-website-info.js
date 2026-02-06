const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const schema = new Schema({
    websiteName: String,
    phone: String,
    email: String,
    address: String,
    logo: String,
    favicon: String,
});

const SettingWebsiteInfo = mongoose.model(
    "SettingWebsiteInfo",
    schema,
    "setting-website-info",
);

module.exports = SettingWebsiteInfo;
