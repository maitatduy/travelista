const Tour = require("../../models/tour.model");
const Order = require("../../models/order.model");
const City = require("../../models/city.model");

const axios = require("axios").default;
const CryptoJS = require("crypto-js");

const variableConfig = require("../../config/variable.config");
const gererateHelper = require("../../helpers/generate.helper");
const sortHelper = require("../../helpers/sort.helper");

const moment = require("moment");

module.exports.createPost = async (req, res) => {
    try {
        req.body.orderCode = "OD" + gererateHelper.generateRandomNumber(10);
        // Danh sách tour
        for (const item of req.body.items) {
            const infoTour = await Tour.findOne({
                _id: item.tourId,
                status: "active",
                deleted: false,
            });

            if (infoTour) {
                // Thêm giá
                item.priceNewAdult = infoTour.priceNewAdult;
                item.priceNewChildren = infoTour.priceNewChildren;
                item.priceNewBaby = infoTour.priceNewBaby;

                // Ngày khởi hành
                item.departureDate = infoTour.departureDate;

                // Ảnh
                item.avatar = infoTour.avatar;

                // Tiêu đề
                item.name = infoTour.name;

                // Cập nhật lại số lượng còn lại của tour
                if (
                    infoTour.stockAdult < item.quantityAdult ||
                    infoTour.stockChildren < item.quantityChildren ||
                    infoTour.stockBaby < item.quantityBaby
                ) {
                    res.json({
                        code: "error",
                        message: `Số lượng chỗ của tour ${item.name} đã hết, vui lòng chọn lại`,
                    });
                    return;
                }

                await Tour.updateOne(
                    {
                        _id: item.tourId,
                    },
                    {
                        stockAdult: infoTour.stockAdult - item.quantityAdult,
                        stockChildren:
                            infoTour.stockChildren - item.quantityChildren,
                        stockBaby: infoTour.stockBaby - item.quantityBaby,
                    },
                );
            }
        }

        // Thanh toán
        // Tạm tính
        req.body.subTotal = req.body.items.reduce((sum, item) => {
            return (
                sum +
                (item.priceNewAdult * item.quantityAdult +
                    item.priceNewChildren * item.quantityChildren +
                    item.priceNewBaby * item.quantityBaby)
            );
        }, 0);

        // Giảm
        req.body.discount = 0;

        // Thanh toán
        req.body.total = req.body.subTotal - req.body.discount;

        // Trạng thái thanh toán
        req.body.paymentStatus = "unpaid"; // unpaid: chưa thánh toán, paid: đã thanh toán

        // Trạng thái đơn hàng
        req.body.status = "initial"; // initial: khởi tạo, done: hoàn thành, cancel: hủy

        const newRecord = new Order(req.body);
        await newRecord.save();

        res.json({
            code: "success",
            message: "Đặt hàng thành công!",
            orderId: newRecord.id,
        });
    } catch (error) {
        console.log(error);

        res.json({
            code: "error",
            message: "Đặt hàng không thành công!",
        });
    }
};

module.exports.success = async (req, res) => {
    try {
        const { orderId, phone } = req.query;

        const orderDetail = await Order.findOne({
            _id: orderId,
            phone: phone,
        });

        if (!orderDetail) {
            res.redirect("/");
            return;
        }

        orderDetail.paymentMethodName = variableConfig.paymentMethod.find(
            (item) => item.value == orderDetail.paymentMethod,
        ).label;

        orderDetail.paymentStatusName = variableConfig.paymentStatus.find(
            (item) => item.value == orderDetail.paymentStatus,
        ).label;

        orderDetail.statusName = variableConfig.orderStatus.find(
            (item) => item.value == orderDetail.status,
        ).label;

        orderDetail.createdAtFormat = moment(orderDetail.createdAt).format(
            "HH:mm - DD/MM/YYYY",
        );

        for (const item of orderDetail.items) {
            const infoTour = await Tour.findOne({
                _id: item.tourId,
                deleted: false,
            });

            if (infoTour) {
                item.slug = infoTour.slug;
            }

            item.departureDateFormat = moment(item.departureDate).format(
                "DD/MM/YYYY",
            );

            const city = await City.findOne({
                _id: item.locationFrom,
            });

            if (city) {
                item.locationFromName = city.name;
            }
        }

        res.render("client/pages/order-success", {
            pageTitle: "Đặt hàng thành công",
            orderDetail: orderDetail,
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
};

module.exports.paymentZaloPay = async (req, res) => {
    try {
        const orderId = req.query.orderId;

        const orderDetail = await Order.findOne({
            _id: orderId,
            paymentStatus: "unpaid",
            deleted: false,
        });

        if (!orderDetail) {
            res.redirect("/");
            return;
        }

        // APP INFO
        const config = {
            app_id: process.env.ZALO_APP_ID,
            key1: process.env.ZALO_KEY_1,
            key2: process.env.ZALO_KEY_2,
            endpoint: process.env.ZALO_DOMAIN,
        };

        const embed_data = {
            redirecturl: `${process.env.ZALO_DOMAIN_WEBSITE}/order/success?orderId=${orderDetail.id}&phone=${orderDetail.phone}`,
        };

        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: `${orderDetail.phone}-${orderDetail.id}`,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: orderDetail.total,
            description: `Thanh toán đơn hàng ${orderDetail.orderCode}`,
            bank_code: "",
            callback_url: `${process.env.ZALO_DOMAIN_WEBSITE}/order/payment-zalopay-result`,
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data =
            config.app_id +
            "|" +
            order.app_trans_id +
            "|" +
            order.app_user +
            "|" +
            order.amount +
            "|" +
            order.app_time +
            "|" +
            order.embed_data +
            "|" +
            order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const response = await axios.post(config.endpoint, null, {
            params: order,
        });
        if (response.data.return_code == 1) {
            res.redirect(response.data.order_url);
        } else {
            res.redirect("/");
        }
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.paymentZaloPayResultPost = async (req, res) => {
    const config = {
        key2: process.env.ZALO_KEY_2,
    };

    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        // Kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // Callback không hợp lệ
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // Thanh toán thành công
            let dataJson = JSON.parse(dataStr, config.key2);
            const [phone, orderId] = dataJson.app_user.split("-");

            await Order.updateOne(
                {
                    _id: orderId,
                    phone: phone,
                    deleted: false,
                },
                {
                    paymentStatus: "paid",
                },
            );

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // Thông báo kết quả cho ZaloPay server
    res.json(result);
};

module.exports.paymentVNPay = async (req, res) => {
    try {
        const orderId = req.query.orderId;

        const orderDetail = await Order.findOne({
            _id: orderId,
            paymentStatus: "unpaid",
            deleted: false,
        });

        if (!orderDetail) {
            res.redirect("/");
            return;
        }

        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");

        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = process.env.VNPAY_CODE;
        let secretKey = process.env.VNPAY_SECRET;
        let vnpUrl = process.env.VNPAY_URL;
        let returnUrl = `${process.env.DOMAIN_WEBSITE}/order/payment-vnpay-result`;
        let orderIdVNP = `${orderId}-${Date.now()}`;
        let amount = orderDetail.total;
        let bankCode = "";

        let locale = "vn";
        let currCode = "VND";
        let vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderIdVNP;
        vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderIdVNP;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        vnp_Params = sortHelper.sortObject(vnp_Params);

        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl);
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.paymentVNPayResult = async (req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortHelper.sortObject(vnp_Params);

    let secretKey = process.env.VNPAY_SECRET;

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        if (
            vnp_Params["vnp_ResponseCode"] == "00" &&
            vnp_Params["vnp_TransactionStatus"] == "00"
        ) {
            const [orderId, date] = vnp_Params["vnp_TxnRef"].split("-");

            const orderDetail = await Order.findOne({
                _id: orderId,
                deleted: false,
            });

            await Order.updateOne(
                {
                    _id: orderId,
                    deleted: false,
                },
                {
                    paymentStatus: "paid",
                },
            );

            res.redirect(
                `${process.env.DOMAIN_WEBSITE}/order/success?orderId=${orderId}&phone=${orderDetail.phone}`,
            );
        } else {
            res.render("client/pages/success", { code: "97" });
        }
    } else {
        res.render("client/pages/success", { code: "97" });
    }
};
