const mongoose = require("mongoose");

const tourSchema = mongoose.model("Tour", {
    name: String,
    vehicle: String,
});

module.exports = tourSchema;