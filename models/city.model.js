const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const schema = new Schema({
    name: String,
});

const City = mongoose.model("City", schema, "cites");

module.exports = City;
