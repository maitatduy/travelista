const Tour = require("../../models/tour.model");
const moment = require("moment");
const slugify = require("slugify");

module.exports.list = async (req, res) => {
    const find = {
        status: "active",
        deleted: false,
    };

    // Điểm đi
    if (req.query.locationFrom) {
        find.locations = req.query.locationFrom;
    }
    // Hết Điểm đi

    // Điểm đến
    if (req.query.locationTo) {
        const keyword = slugify(req.query.locationTo, {
            lower: true,
        });
        const keywordRegex = new RegExp(keyword);
        find.slug = keywordRegex;
    }
    // Hết Điểm đến

    // Ngày khởi hành
    if (req.query.departureDate) {
        find.departureDate = new Date(req.query.departureDate);
    }
    // Hết Ngày khởi hành

    // Số lượng hành khách
    // Người lớn
    if (req.query.stockAdult) {
        find.stockAdult = {
            $gte: parseInt(req.query.stockAdult),
        };
    }

    // Trẻ em
    if (req.query.stockChildren) {
        find.stockChildren = {
            $gte: parseInt(req.query.stockChildren),
        };
    }

    // Em bé
    if (req.query.stockBaby) {
        find.stockBaby = {
            $gte: parseInt(req.query.stockBaby),
        };
    }

    // Hết Số lượng hành khách

    // Mức giá
    if (req.query.price) {
        const [priceMin, priceMax] = req.query.price
            .split("-")
            .map((item) => parseInt(item));

        find.priceNewAdult = {
            $gte: priceMin,
            $lte: priceMax,
        };
    }
    // Hết Mức giá

    const tourList = await Tour.find(find).sort({
        position: "desc",
    });

    for (const item of tourList) {
        item.departureDateFormat = moment(item.departureDate).format(
            "DD/MM/YYYY",
        );
    }

    res.render("client/pages/search", {
        pageTitle: "Kết quả tìm kiếm",
        tourList: tourList,
    });
};
