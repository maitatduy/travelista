const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, content) => {
    const secure = process.env.EMAIL_SECURE === "true";

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: `"Travelista" ${process.env.EMAIL_USERNAME}`,
        to: email,
        subject: subject,
        html: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
}