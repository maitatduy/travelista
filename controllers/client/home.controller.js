const moment = require("moment");
const Tour = require("../../models/tour.model");
const categoryHelper = require("../../helpers/category.helper");

module.exports.home = async (req, res) => {
    const tourListSection2 = await Tour.find({
        deleted: false,
        status: "active",
    })
        .sort({
            position: "desc",
        })
        .limit(6);
    for (const item of tourListSection2) {
        item.departureDateFormated = moment(item.departureDate).format(
            "DD-MM-YYYY",
        );
    }

    const categoryIdSection4 = "6994011ac4fb6ce2fa34a8d3"; // ID danh mục Tour Trong Nước
    const listCategoryId =
        await categoryHelper.getAllSubcategoryIds(categoryIdSection4);

    const tourListSection4 = await Tour.find({
        category: { $in: listCategoryId },
        deleted: false,
        status: "active",
    })
        .sort({
            position: "desc",
        })
        .limit(8);

    for (const item of tourListSection4) {
        item.departureDateFormat = moment(item.departureDate).format(
            "DD/MM/YYYY",
        );
    }

    const categoryIdSection6 = "6994010fc4fb6ce2fa34a8bd"; // ID danh mục Tour Nước Ngoài
    const listCategoryId2 =
        await categoryHelper.getAllSubcategoryIds(categoryIdSection6);

    const tourListSection6 = await Tour.find({
        category: { $in: listCategoryId2 },
        deleted: false,
        status: "active",
    })
        .sort({
            position: "desc",
        })
        .limit(8);

    for (const item of tourListSection6) {
        item.departureDateFormat = moment(item.departureDate).format(
            "DD/MM/YYYY",
        );
    }

    res.render("client/pages/home", {
        pageTitle: "Trang chủ",
        tourListSection2: tourListSection2,
        tourListSection4: tourListSection4,
        tourListSection6: tourListSection6,
    });
};
