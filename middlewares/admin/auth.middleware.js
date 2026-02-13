const { pathAdmin } = require("../../config/variable.config");
const AccountAdmin = require("../../models/account-admin.model");
const Role = require("../../models/role.model");
const jwt = require("jsonwebtoken");

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.redirect(`/${pathAdmin}/account/login`);
            return;
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const { id, email } = decode;
        const existAccount = await AccountAdmin.findOne({
            _id: id,
            email: email,
            status: "active",
        });

        if (!existAccount) {
            res.clearCookie("token");
            res.redirect(`/${pathAdmin}/account/login`);
            return;
        }

        const role = await Role.findOne({
            _id: existAccount.role,
        });

        existAccount.roleName = role.name;

        req.account = existAccount;

        res.locals.account = existAccount;

        next();
    } catch (error) {
        res.clearCookie("token");
        res.redirect(`/${pathAdmin}/account/login`);
    }
};
