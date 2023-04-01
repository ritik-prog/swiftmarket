const Seller = require('../../models/seller/sellerSchema');
const applyForSellerModel = require('../../models/seller/applySellerSchema');
const { validationResult } = require('express-validator');

const Product = require('../../models/product/productSchema');

// Apply for seller account
const applyForSellerAccount = async (req, res, next) => {
    try {
        // Extract required fields from request body
        const {
            fullName,
            email,
            phoneNumber,
            businessName,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            productCategories,
        } = req.body;

        // Create a new seller instance with required fields
        const newSeller = new applyForSellerModel({
            fullName,
            email,
            phoneNumber,
            businessName,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            productCategories,
            user: req.user._id, // Link the seller account to the current user
        });

        // Save the new seller instance to the database
        const savedSeller = await newSeller.save();

        res.status(201).json({
            success: true,
            message: 'Seller account created successfully',
            data: savedSeller,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Verify a seller
const verifySeller = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, code, paymentPreferences, blockchainWalletAddress, paypalAccountEmailAddress } = req.body;

    try {
        // Find the seller by the verification code
        const seller = await Seller.findOne({ email: email });

        if (!seller) {
            return res.status(400).json({ errors: [{ message: 'Invalid or expired verification code' }] });
        }

        if (!seller.verificationStatus) {
            // Check if the verification code is not expired
            if (seller.verificationCodeExpiresAt < Date.now()) {
                // If expired, generate a new code and send an email with the new code
                const newVerificationCode = Math.floor(100000 + Math.random() * 900000);
                seller.verificationCode = newVerificationCode;
                seller.verificationCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // Set new code expiry to 24 hours
                await seller.save();

                const data = {
                    username: seller.fullName,
                    verificationCode: seller.verificationCode,
                    verificationLink: 'https://example.com/verify'
                };

                const status = await sendEmail(seller.email, data, 'verficationCode.hbs');

                res.status(202).json({ success: success, message: 'Verification code sent' });
            } else {
                if (seller.verificationCode === code) {
                    seller.paymentPreferences = paymentPreferences;
                    seller.blockchainWalletAddress = blockchainWalletAddress;
                    seller.paypalAccountEmailAddress = paypalAccountEmailAddress;
                    seller.verificationStatus = true;
                    seller.verificationCode = null;
                    seller.verificationCodeExpiresAt = null;
                    await seller.save();
                } else {
                    res.status(400).json({ success: false, message: 'Wrong verification code' });
                }
            }
            // Send a success response
            res.status(200).json({ success: true, message: 'Seller account verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Seller account already verified' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a seller by ID
const getSellerById = async (req, res) => {
    try {
        const seller = await Seller.findById(req.body._id);
        if (!seller) {
            return res.status(404).json({ status: 'error', message: 'Seller not found' });
        }
        res.status(200).json({ status: 'success', data: seller });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ status: 'error', message: 'Seller not found' });
        }
        res.status(500).json({ status: 'error', message: 'Server Error', error: err.message });
    }
};

// Update a seller by ID
const updateSellerById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', message: 'Validation error', errors: errors.array() });
    }

    const {
        fullName,
        email,
        phoneNumber,
        businessName,
        businessRegistrationNumber,
        businessType,
        businessAddress,
        businessWebsite,
        taxIDNumber,
        paymentPreferences,
        blockchainWalletAddress,
        paypalAccountEmailAddress,
        productCategories,
        productListings,
        salesHistory,
        ratingsAndReviews
    } = req.body;

    const sellerFields = {};
    if (fullName) sellerFields.fullName = fullName;
    if (email) sellerFields.email = email;
    if (phoneNumber) sellerFields.phoneNumber = phoneNumber;
    if (businessName) sellerFields.businessName = businessName;
    if (businessRegistrationNumber) sellerFields.businessRegistrationNumber = businessRegistrationNumber;
    if (businessType) sellerFields.businessType = businessType;
    if (businessAddress) sellerFields.businessAddress = businessAddress;
    if (businessWebsite) sellerFields.businessWebsite = businessWebsite;
    if (taxIDNumber) sellerFields.taxIDNumber = taxIDNumber;
    if (paymentPreferences) sellerFields.paymentPreferences = paymentPreferences;
    if (blockchainWalletAddress) sellerFields.blockchainWalletAddress = blockchainWalletAddress;
    if (paypalAccountEmailAddress) sellerFields.paypalAccountEmailAddress = paypalAccountEmailAddress;
    if (productCategories) sellerFields.productCategories = productCategories;
    if (productListings) sellerFields.productListings = productListings;
    if (salesHistory) sellerFields.salesHistory = salesHistory;
    if (ratingsAndReviews) sellerFields.ratingsAndReviews = ratingsAndReviews;

    try {
        let seller = await Seller.findById(req.params.id);

        if (!seller) {
            return res.status(404).json({ status: 'error', message: 'Seller not found' });
        }

        if (seller.user.toString() !== req.user.id) {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        seller = await Seller.findByIdAndUpdate(req.params.id, { $set: sellerFields }, { new: true });

        res.status(200).json({ status: 'success', message: 'Seller updated successfully', data: seller });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// Delete a seller by ID
const deleteSellerById = async (req, res) => {
    try {
        const seller = await Seller.findById(req.body._id);
        if (!seller) {
            return res.status(404).json({ status: 'error', message: 'Seller not found' });
        }

        // Check if user is authorized to delete the seller
        if (seller.user.toString() !== req.body._id) {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        await Seller.findByIdAndDelete(req.body._id);
        res.status(200).json({ status: 'success', message: 'Seller deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// Create product for seller
const createProductForSeller = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const seller = await Seller.findOne({ _id: req.user._id });
        if (!seller) {
            return res.status(404).json({
                status: 'error',
                message: 'Seller not found'
            });
        }

        const product = new Product({
            seller: seller._id,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            imagesUrl: req.body.imagesUrl,
            thumbnailUrl: req.body.thumbnailUrl,
            featured: req.body.featured || false
        });
        await product.save();

        res.status(201).json({
            status: 'success',
            message: 'Created a new product',
            data: {
                product
            }
        });
    } catch (err) {
        next(err);
    }
};

// Update product for seller
const updateProductForSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const seller = await Seller.findOne({ _id: req.user._id });
        if (!seller) {
            return res.status(404).json({
                status: 'error',
                message: 'Seller not found'
            });
        }

        const product = await Product.findOne({ _id: req.params.productId, seller: seller._id });
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        product.productName = req.body.productName;
        product.productDescription = req.body.productDescription;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.category = req.body.category;
        product.imagesUrl = req.body.imagesUrl;
        product.thumbnailUrl = req.body.thumbnailUrl;
        product.featured = req.body.featured || false;

        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: {
                product
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

// DELETE a product of a seller
const deleteProductForSeller = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }
        res.status(204).json({
            status: 'success',
            message: 'Deleted the product'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

module.exports = { getSellerById, updateSellerById, deleteSellerById, deleteProductForSeller, updateProductForSeller, createProductForSeller, applyForSellerAccount, verifySeller };