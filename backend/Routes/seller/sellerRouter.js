const express = require('express');
const { check } = require('express-validator');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');
const sellerController = require('../../controllers/seller/sellerController');
const checkVerificationMiddleware = require('../../middleware/checkVerificationMiddleware');

const router = express.Router();

// Apply for seller account
router.post('/apply', [
    authenticateMiddleware,
    checkVerificationMiddleware,
    check('businessNumber').notEmpty().isNumeric(),
    check('businessName').notEmpty().isString().trim(),
    check('businessEmail').notEmpty().isEmail().normalizeEmail(),
    check('businessUsername').notEmpty().isString().trim(),
    check('businessRegistrationNumber').notEmpty().isString().trim(),
    check('businessType').notEmpty().isString().trim(),
    check('businessAddress').notEmpty().isString().trim(),
    check('businessWebsite').notEmpty().isURL(),
    check('taxIDNumber').notEmpty().isString().trim(),
    check('productCategories').isArray(),
], sellerController.applyForSellerAccount);

// Route for verifying a seller
router.post('/verify', [
    authenticateMiddleware,
    checkVerificationMiddleware,
    check('code', 'Verification code is required').notEmpty(),
    check('paymentPreferences', 'Please include a valid payment preferences').notEmpty(),
    check('blockchainWalletAddress', 'Please include a valid wallet address').notEmpty(),
    check('paypalAccountEmailAddress', 'Please include a valid email').isEmail(),
], sellerController.verifySeller);

// Get a seller by ID
router.get('/profile', [authenticateMiddleware, authorizeMiddleware(['seller']), checkVerificationMiddleware], sellerController.getSellerById);

// Update a seller by ID
router.put('/updateprofile', [
    authenticateMiddleware,
    authorizeMiddleware(['seller']),
    checkVerificationMiddleware,
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
router.delete('/deleteprofile', [authenticateMiddleware, authorizeMiddleware(['seller']), checkVerificationMiddleware], sellerController.deleteSellerById);

// Create a product of a seller
router.put('/createproduct', [authenticateMiddleware, authorizeMiddleware(['seller']), checkVerificationMiddleware,
    check('productName').notEmpty(),
    check('productDescription').notEmpty(),
    check('price').isNumeric().notEmpty(),
    check('quantity').isInt({ gt: 0 }).notEmpty(),
    check('category').notEmpty(),
    check('imagesUrl').isArray().notEmpty(),
    check('thumbnailUrl').isString,], sellerController.createProductForSeller);

// UPDATE a product of a seller
router.put('/updateproduct', [authenticateMiddleware, authorizeMiddleware(['seller']), checkVerificationMiddleware], sellerController.updateProductForSeller);

// DELETE a product of a seller
router.delete('/deleteproduct', [authenticateMiddleware, authorizeMiddleware(['seller']), checkVerificationMiddleware], sellerController.deleteProductForSeller);

module.exports = router;
