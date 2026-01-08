const tourSchema = require("../../models/tour.model");

module.exports.list = async (req, res) => {
    const tours = await tourSchema.find({});
    res.render("client/pages/tour-list", {
        pageTitle: "Trang danh sách tour",
        tours: tours,
    });
}

module.exports.detail = async (req, res) => {
    res.render("client/pages/tour-detail", {
        pageTitle: "Trang chi tiết tour"
    });
}