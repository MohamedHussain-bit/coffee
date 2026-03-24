const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        secure : true,
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASSWORD
        }
    });
    // Define email option (from , to , texst)
    const mailOption = {
        from : 'Coffee-App <medohussain51@gmail.com>',
        to : options.email,
        subject : options.subject,
        text : options.message
    };
    await transporter.sendMail(options);
};

module.exports = sendEmail;