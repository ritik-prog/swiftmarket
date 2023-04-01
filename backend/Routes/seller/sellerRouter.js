const express = require('express');
const { check } = require('express-validator');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');
const sellerController = require('../../controllers/seller/sellerController');

const router = express.Router();

// Get a seller by ID
router.get('/profile', [authenticateMiddleware, authorizeMiddleware('seller')], sellerController.getSellerById);

// Update a seller by ID
router.put('/updateprofile', [
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
router.delete('/deleteprofile', [authenticateMiddleware, authorizeMiddleware('seller')], sellerController.deleteSellerById);

// Create a product of a seller
router.put('/createproduct', [authenticateMiddleware, authorizeMiddleware('seller'), authorizeMiddleware('seller'),
    check('productName').notEmpty(),
    check('productDescription').notEmpty(),
    check('price').isNumeric().notEmpty(),
    check('quantity').isInt({ gt: 0 }).notEmpty(),
    check('category').notEmpty(),
    check('imagesUrl').isArray().notEmpty(),
    check('thumbnailUrl').isString,], sellerController.createProductForSeller);

// UPDATE a product of a seller
router.put('/updateproduct', [authenticateMiddleware, authorizeMiddleware('seller')], sellerController.updateProductForSeller);

// DELETE a product of a seller
router.delete('/deleteproduct', [authenticateMiddleware, authorizeMiddleware('seller')], sellerController.deleteProductForSeller);

module.exports = router;
