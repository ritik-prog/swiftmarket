const express = require('express');
const { check } = require('express-validator');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');
const sellerController = require('../../controllers/seller/sellerController');

// Create new seller
router.post('/', [
    check('fullName').not().isEmpty(),
    check('userId').not().isEmpty(),
    check('email').isEmail(),
    check('phoneNumber').isMobilePhone(),
    check('businessName').not().isEmpty(),
    check('businessRegistrationNumber').not().isEmpty(),
    check('businessType').not().isEmpty(),
    check('businessAddress').not().isEmpty(),
    check('businessWebsite').isURL(),
    check('taxIDNumber').not().isEmpty(),
    check('paymentPreferences').not().isEmpty(),
    check('blockchainWalletAddress').not().isEmpty(),
    check('paypalAccountEmailAddress').isEmail(),
    check('productCategories').isArray(),
    rateLimiterMiddleware
], sellerController.createSeller);

module.exports = router;