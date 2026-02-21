const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model");
const categoryHelper = require("../../helpers/category.helper");
const moment = require("moment");
const City = require("../../models/city.model");

module.exports.list = async (req, res) => {
    const slug = req.params.slug;

    const category = await Category.findOne({
        slug: slug,
        deleted: false,
        status: "active",
    });

    if (category) {
        const breadcrumb = {
            image: category.avatar,
            title: category.name,
            list: [
                {
                    link: "/",
                    title: "Trang Chủ",
                },
            ],
        };

        if (category.parent) {
            const parentCategory = await Category.findOne({
                _id: category.parent,
                deleted: false,
                status: "active",
            });

            if (parentCategory) {
                breadcrumb.list.push({
                    link: `/category/${parentCategory.slug}`,
                    title: parentCategory.name,
                });
            }
        }

        breadcrumb.list.push({
            link: `/category/${category.slug}`,
            title: category.name,
        });

        // Danh sách tour thuộc danh mục
        const listCategoryId = await categoryHelper.getAllSubcategoryIds(
            category.id,
        );

        const find = {
            category: { $in: listCategoryId },
            deleted: false,
            status: "active",
        };

        const tourList = await Tour.find(find)
            .sort({
                position: "desc",
            })
            .limit(8);

        const totalTour = await Tour.countDocuments();

        for (const item of tourList) {
            item.departureDateFormat = moment(item.departureDate).format(
                "DD/MM/YYYY",
            );
        }

        // Danh sách thành phố
        const cityList = await City.find({});

        res.render("client/pages/tour-list", {
            pageTitle: breadcrumb.title,
            breadcrumb: breadcrumb,
            category: category,
            tourList: tourList,
            totalTour: totalTour,
            cityList: cityList,
        });
    } else {
        res.redirect("/");
    }
};

module.exports.detail = async (req, res) => {
    res.render("client/pages/tour-detail");
};
