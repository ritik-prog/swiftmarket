const express = require('express');
const { check } = require('express-validator');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');
const rateLimiterMiddleware = require('../../Middleware/rateLimitermiddleware');
const sellerController = require('../../controllers/seller/sellerController');

const router = express.Router();

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

// Get all sellers
router.get('/', [authenticateMiddleware, authorizeMiddleware('admin')], sellerController.getAllSellers);

// Get a seller by ID
router.get('/:id', [authenticateMiddleware, authorizeMiddleware('seller')], sellerController.getSellerById);

// Update a seller by ID
router.put('/:id', [
    authenticateMiddleware,
    authorizeMiddleware('seller'),
    check('fullName').not().isEmpty(),
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
], sellerController.updateSellerById);

// Delete a seller by ID
router.delete('/:id', [authenticateMiddleware, authorizeMiddleware('admin')], sellerController.deleteSellerById);

module.exports = router;
