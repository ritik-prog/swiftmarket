const express = require('express');
const { check } = require('express-validator');
const authController = require('../../controllers/auth/authController');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const checkBanMiddleware = require('../../Middleware/checkBanMiddleware');
const signupRateLimiter = require('../../Middleware/signupRateLimiter');
const { sendVerificationCodeAgain, verifyUser } = require('../../Controllers/auth/userVerification');

const router = express.Router();

// Signup route
router.post(
    '/signup',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('username', 'Username is required').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('role', 'Role is required').not().isEmpty(),
        signupRateLimiter,
        checkBanMiddleware,
    ],
    authController.signup
);

// Login route
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        checkBanMiddleware,
    ],
    authController.login
);

// Get user details
router.get('/profile', [authenticateMiddleware], authController.getUser);

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
router.post('/logout', authController.logout);

// Email Verification
router.post('/sendVerificationCodeAgain', async (req, res) => {
    let status = await sendVerificationCodeAgain(req.body.email);
    res.send(status);
});

router.post('/verify', async (req, res) => {
    let status = await verifyUser(req.body.email, req.body.code);
    res.send(status);
});

module.exports = router;
