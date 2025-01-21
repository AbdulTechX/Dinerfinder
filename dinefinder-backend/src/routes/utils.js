const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (length = 32) => crypto.randomBytes(length).toString('hex');

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};

module.exports = { generateToken, sendEmail };
