const nodemailer = require('nodemailer');
const logger = require('../libs/loggerLib');
const response = require('../libs/responseLib');
const appConfig = require("../../config/appConfig");

let sendEmail = (toEmail,ccEmail, title, message) => {
    return new Promise((resolve) => {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587 ,
            service: 'gmail',
        //    // secureConnection: 'false',
        //    // tls: {
        //         ciphers: 'SSLv3',
        //         rejectUnauthorized: false
        //     //},
        //     
        auth: {
                user: 'miteshwalketech@gmail.com',
                pass: 'mwcool14111997'
            }
        });
        const mailOptions = {
            from: '"HelpDesk" <noReply@gmail.com>',
            to: toEmail,
            cc: ccEmail,
            subject: `Meeting Planner: ${title}`,
            html: message,
            text: "Hey User, Don't worry we got you coverd ;-)"
        };
        try{
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    logger.error('Sent Mail Failed!', 'nodemailer.sendMail', 10);
                    let apiResponse = response.generate(true, 'Send email failed', 500, null);
                    resolve(apiResponse);
                }
                else {
                    logger.info('Mail Sent Successfully to your registerd email', 'nodemailer.sendMail', 10);
                    resolve(info);
                }
            });
        }catch (err){
            resolve(err);
        }
    });
}

module.exports = { sendEmail: sendEmail }

