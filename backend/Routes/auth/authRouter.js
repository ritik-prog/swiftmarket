const express = require('express');
const { check } = require('express-validator');
const authController = require('../../controllers/auth/authController');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const rateLimiterMiddleware = require('../../middleware/rateLimiterMiddleware');

const router = express.Router();

router.get('/', authenticateMiddleware, (req, res) => {
    res.send('Auth api');
});

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
        rateLimiterMiddleware,
    ],
    authController.signup
);


// Login route
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        rateLimiterMiddleware,
    ],
    authController.login
);

// Get user details
router.get('/me', authenticateMiddleware, authController.getUser);

module.exports = router;
