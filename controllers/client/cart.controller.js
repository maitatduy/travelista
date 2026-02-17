module.exports.cart = async (req, res) => {
    res.render("client/pages/cart", {
        pageTitle: "Trang giỏ hàng",
    });
};
