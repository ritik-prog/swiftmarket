const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authenticateMiddleware = require('../Middleware/authenticateMiddleware');
const rateLimiterMiddleware = require('../Middleware/rateLimiterMiddleware');

const router = express.Router();

// Signup route
router.post(
    '/signup',
    rateLimiterMiddleware,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    authController.signup
);

// Login route
router.post(
    '/login',
    rateLimiterMiddleware,
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.login
);

// Get user details
router.get('/me', authenticateMiddleware, authController.getUser);

module.exports = router;
