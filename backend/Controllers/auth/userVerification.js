const crypto = require('crypto');
const nodemailer = require("nodemailer");
const { google } = require('googleapis');

const User = require('../../Models/auth/userSchema');
const renderTemplate = require('../../template/renderTemplate');

const { OAuth2 } = google.auth;

function generateVerificationCode(email,) {
    const buffer = crypto.randomBytes(3);
    const code = buffer.readUInt16BE(0) % 10000; // restrict to 4 digits
    return code.toString().padStart(4, '0'); // pad with leading zeros if necessary
}

async function sendEmail(user) {
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

    const data = {
        username: user.username,
        verificationCode: user.verificationCode,
        verificationLink: 'https://example.com/verify'
    };

    // Render email template
    const html = renderTemplate('verficationCode.hbs', data);


    // Set email message
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: 'Verification Code',
        html: html
    };


    // Send email
    const result = await transporter.sendMail(mailOptions);
    return result;
}

const sendVerificationCode = async (email) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return { success: false, message: 'User not found.', status: 404 };
        }
        if (!user.verificationStatus) {
            const verificationCode = generateVerificationCode();
            const codeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

            // Save verification code and expiry time to user document
            const updatedUser = await User.findOneAndUpdate(
                { email: email },
                { $set: { verificationCode: verificationCode, codeExpiry: codeExpiry } },
                { new: true }
            );
            updatedUser.save();



            // Send email
            const result = await sendEmail(updatedUser);

            return { success: true, message: 'Verification code sent successfully.', status: 200 };
        } else {
            return { success: false, message: 'User is already verified.', status: 500 };
        }
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Failed to send verification code.', status: 500 };
    }
};

const verifyUser = async (email, verificationCode) => {
    try {
        // Check if user exists and code has not expired
        const user = await User.findOne({ email: email });
        if (!user) {
            return { success: false, message: 'User not found.', status: 404 };
        }
        if (user.verificationStatus) {
            user.verificationStatus = true;
            user.verificationCode = "";
            await user.save();
            return { success: false, message: 'User is already verified.', status: 500 };
        }
        if (user.codeExpiry < Date.now()) {
            return { success: false, message: 'Verification code has expired.', status: 500 };
        }

        // Check if verification code is correct
        if (user.verificationCode !== verificationCode) {
            return { success: false, message: 'Verification code is incorrect.', status: 500 };
        }

        // Set user verification status to true and save
        user.verificationStatus = true;
        user.verificationCode = "";
        await user.save();

        return { success: true, message: 'User verified successfully.', status: 200 };
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Failed to verify user.', status: 500 };
    }
};

async function sendVerificationCodeAgain(email) {
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return { message: 'User not found', status: 404, success: false };
        }

        // Check if user has not verified yet
        if (!user.verificationStatus) {
            // Check if verification code has expired
            const now = new Date();
            if (now > user.verificationCodeExpiresAt) {
                // Generate new code and set new expiry time
                const verificationCode = generateVerificationCode();
                const codeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

                // Update user document
                user.verificationCode = verificationCode;
                user.verificationCodeExpiresAt = codeExpiry;
                await user.save();
            }

            const result = sendEmail(user)
            return { message: 'Verification code sent successfully.', status: 200, success: true };
        } else {
            return { success: false, message: 'User is already verified.', status: 500 };
        }
    } catch (err) {
        console.error(err);
        return { message: 'Failed to send verification code.', status: 500, success: false };
    }
}

module.exports = { sendVerificationCode, verifyUser, sendVerificationCodeAgain };
