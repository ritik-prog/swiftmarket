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
        check('username', 'Username is required').not().isEmpty().isLength({ min: 4, max: 15 }),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
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

// check if user is logged in
router.get('/check', [checkBanMiddleware, authenticateMiddleware], (req, res) => res.status(200).json({ status: 'success', message: 'User is logged in', user: req.user }));

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
        check('username', 'Username is required').notEmpty().trim(),
        check('name', 'Name is required').notEmpty().trim(),
        check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
        check('address', 'Address is required').notEmpty().trim(),
        check('number', 'Address is required').notEmpty().trim(),
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
router.put('/deleteaccount', [checkBanMiddleware, authenticateMiddleware,
    checkVerificationMiddleware,], authController.deleteAccount);

// Logout route
router.post('/logout', [checkBanMiddleware, authenticateMiddleware,
    checkVerificationMiddleware,], authController.logout);

module.exports = router;
