module.exports.list = async (req, res) => {
    res.render("admin/pages/contact-list", {
        pageTitle: "Trang thông tin liên hệ"
    });
}