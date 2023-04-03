const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../../controllers/auth/authController');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const checkBanMiddleware = require('../../Middleware/checkBanMiddleware');
const signupRateLimiter = require('../../Middleware/signupRateLimiter');
const { sendVerificationCodeAgain, verifyUser } = require('../../controllers/auth/verificationController');
const handleError = require('../../utils/errorHandler');
const checkVerificationMiddleware = require('../../middleware/checkVerificationMiddleware');


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
    [authenticateMiddleware],
    async (req, res) => {
        try {
            const { email } = req.user;
            const status = await sendVerificationCodeAgain(email);
            return res.status(200).json({ status: 'success', ...status });
        } catch (err) {
            return handleError(res, err);
        }
    });

router.post('/verify',
    [
        check('code').isLength({ min: 4, max: 4 }).isNumeric(),
        authenticateMiddleware
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return handleError(res, {
                    name: 'CustomValidationError',
                    status: 'error',
                    errors: errors.array()
                });
            }

            if (req.user.verificationStatus) {
                return res.status(411).json({ status: 'error', message: 'User already verified' });
            }

            const { code } = req.body;
            const status = await verifyUser(req.user.email, code);
            res.status(200).json({ status: 'success', ...status });
        } catch (err) {
            return handleError(res, err);
        }
    });

// Get user details
router.get('/profile', [
    checkBanMiddleware, authenticateMiddleware, checkVerificationMiddleware], authController.getUser);

// Update user details
router.put(
    '/updateprofile',
    [
        checkBanMiddleware,
        authenticateMiddleware, checkVerificationMiddleware,
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
        checkBanMiddleware,
        authenticateMiddleware,
        checkVerificationMiddleware,
        check('currentPassword', 'Current password is required').exists(),
        check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 }),
    ],
    authController.updatePassword
);

// Delete account
router.delete('/deleteaccount', [checkBanMiddleware, authenticateMiddleware,
    checkVerificationMiddleware,], authController.deleteAccount);

// Logout route
router.post('/logout', [checkBanMiddleware, authenticateMiddleware,
    checkVerificationMiddleware,], authController.logout);

module.exports = router;
