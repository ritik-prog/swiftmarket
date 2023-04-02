const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../../controllers/auth/authController');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const checkBanMiddleware = require('../../Middleware/checkBanMiddleware');
const signupRateLimiter = require('../../Middleware/signupRateLimiter');
const { sendVerificationCodeAgain, verifyUser } = require('../../controllers/auth/verificationController');

const router = express.Router();

// Signup route
router.post(
    '/signup',
    [
        signupRateLimiter,
        checkBanMiddleware,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('username', 'Username is required').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('role', 'Role is required').not().isEmpty()
    ],
    authController.signup
);

// Login route
router.post(
    '/login',
    [
        checkBanMiddleware,
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.login
);

// Email Verification
router.post('/sendVerificationCodeAgain',
    [check('email').isEmail(), authenticateMiddleware],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid email',
                    errors: errors.array()
                });
            }
            const { email } = req.body;
            const status = await sendVerificationCodeAgain(email);
            res.status(200).json({ status: 'success', message: status });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ status: 'error', message: 'Server Error' });
        }
    });

router.post('/verify',
    [check('email').isEmail(), check('code').isNumeric(), authenticateMiddleware],
    async (req, res) => {
        try {
            if (req.user.verificationStatus) return res.status(400).json({ status: 'error', message: 'User already verified' });
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid email or verification code',
                    errors: errors.array()
                });
            }
            const { email, code } = req.body;
            const status = await verifyUser(email, code);
            res.status(200).json({ status: 'success', message: status });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ status: 'error', message: 'Server Error' });
        }
    });

// Get user details
router.get('/profile', [
    checkBanMiddleware, authenticateMiddleware], authController.getUser);

// Update user details
router.put(
    '/updateprofile',
    [
        authenticateMiddleware,
        check('username', 'Username is required').notEmpty().trim().escape(),
        check('name', 'Name is required').notEmpty().trim().escape(),
        check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
        check('address', 'Address is required').notEmpty().trim().escape(),
        check('paymentDetails.cardNumber', 'Please enter a valid credit card number')
            .notEmpty()
            .isCreditCard()
            .escape(),
        check('paymentDetails.expiryDate', 'Please enter a valid expiry date in ISO 8601 format')
            .notEmpty()
            .isISO8601()
            .toDate(),
        check('paymentDetails.cvc', 'Please enter a valid CVC code').notEmpty().isInt({ min: 100, max: 999 }).toInt(),
    ],
    authController.updateProfile
);

// Update password
router.put(
    '/updatepassword',
    [
        check('currentPassword', 'Current password is required').exists(),
        check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 }),
    ],
    authController.updatePassword
);

// Logout route
router.post('/logout', [authenticateMiddleware], authController.logout);

module.exports = router;
