const tourSchema = require("../../models/tour.model");

module.exports.list = async (req, res) => {
    const tours = await tourSchema.find({});
    res.render("client/pages/tour-list", {
        pageTitle: "Trang danh sách tour",
        tours: tours,
    })
}