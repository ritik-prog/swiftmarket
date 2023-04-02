const User = require('../../models/auth/userSchema');
const sendEmail = require('../../utils/sendEmail');
const generateVerificationCode = require('../../utils/generateCode');

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
            user.verificationCode = verificationCode;
            user.verificationCodeExpiresAt = codeExpiry;
            await user.save();

            const data = {
                username: user.username,
                verificationCode: user.verificationCode,
                verificationLink: 'https://example.com/verify'
            };

            // Send email
            await sendEmail(user.email, data, 'verficationCode.hbs');

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

            const data = {
                username: user.username,
                verificationCode: user.verificationCode,
                verificationLink: 'https://example.com/verify'
            };

            // Send email
            await sendEmail(user.email, data, 'verficationCode.hbs');
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
