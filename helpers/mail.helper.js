const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, content) => {
    const secure = process.env.EMAIL_SECURE === "true";

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: secure, // http: false, https: true
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
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