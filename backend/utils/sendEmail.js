const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const renderTemplate = require('../template/renderTemplate');


async function sendEmail(email, data, templateName) {
    // Create OAuth2 client for Gmail API
    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    // Set credentials for Gmail API
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Create Nodemailer transporter with OAuth2 authentication
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_ADDRESS,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: oauth2Client.getAccessToken(),
        },
    });

    // Render email template
    const html = renderTemplate(templateName, data);

    // Set email message
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Verification Code',
        html: html
    };


    // Send email
    const result = await transporter.sendMail(mailOptions);
    return result;
}

module.exports = { sendEmail }