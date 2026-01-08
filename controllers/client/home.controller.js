module.exports.home = async (req, res) => {
    res.render("client/pages/home", {
        pageTitle: "Trang chủ",
    });
}