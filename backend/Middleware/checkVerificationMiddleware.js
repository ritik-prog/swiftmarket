const checkVerificationMiddleware = async (req, res, next) => {
    try {
        // Check user verification status
        if (req.user.verificationCode && !req.user.verificationStatus) {
            return res.status(413).json({ status: 'info', message: 'Verification pending', code: 'verification_pending' });
        }
        // Check user verification status
        if (!req.user.verificationStatus) {
            return res.status(414).json({ status: 'error', message: 'Unauthorized: Email not verified', code: 'unauthorized_email' });
        }
        next();
    } catch (err) {
        return res.status(415).json({ status: 'error', message: 'Unauthorized: Invalid token' });
    }
};

module.exports = checkVerificationMiddleware;
