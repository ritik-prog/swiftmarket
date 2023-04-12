const { validationResult } = require('express-validator');

const Seller = require('../../models/seller/sellerSchema');
const applyForSellerModel = require('../../models/seller/applySellerSchema');
const Product = require('../../models/product/productSchema');
const sendEmail = require('../../utils/sendEmail');

const handleError = require('../../utils/errorHandler');

// Apply for seller account
const applyForSellerAccount = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                name: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }
        // Extract required fields from request body
        const {
            businessNumber,
            businessName,
            businessEmail,
            businessUsername,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            productCategories,
        } = req.body;

        // Check if there is already an existing seller with the same business email or business username
        const existingSeller = await Seller.findOne({
            $or: [
                { businessEmail: businessEmail },
                { businessUsername: businessUsername }
            ]
        });
        if (existingSeller) {
            return handleError(res, {
                name: 'already_exists',
                status: 'error',
                message: 'There is already an existing seller with the same business email or business username',
            });
        }

        // Create a new seller instance with required fields
        const newSeller = new applyForSellerModel({
            businessNumber,
            businessEmail,
            businessUsername,
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

        res.status(200).json({
            status: 'success',
            message: 'successfully applied for seller account',
            data: savedSeller,
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// Verify a seller
const verifySeller = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            name: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    console.log(req.user)
    const { code, paymentPreferences, blockchainWalletAddress, paypalAccountEmailAddress } = req.body;

    try {
        // Find the seller by the verification code
        const seller = req.seller;

        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
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
                    verificationLink: 'https://example.com/verify',
                    subject: 'Verify seller account - SwiftMarket'
                };

                await sendEmail(seller.email, data, './verfication/verficationCode.hbs');

                res.status(200).json({ status: 'success', message: 'Verification code sent' });
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
                    return res.status(412).json({ message: 'Invalid or expired verification code', status: 'success' });
                }
            }
            // Send a success response
            res.status(200).json({ status: 'success', message: 'Seller account verified successfully' });
        } else {
            res.status(411).json({ status: 'error', message: 'Seller account already verified' });
        }
    } catch (err) {
        return handleError(res, err);
    }
};

// Get a seller by ID
const getSellerProfile = async (req, res) => {
    try {
        res.status(200).json({ status: 'success', data: req.seller });
    } catch (err) {
        return handleError(res, err);
    }
};

// Update a seller by ID
const updateSellerById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            name: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    try {
        let seller = await Seller.findById(req.params.id);

        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
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


        if (seller.user.toString() !== req.user.id) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        seller = await Seller.findByIdAndUpdate(req.params.id, { $set: sellerFields }, { new: true });

        res.status(200).json({ status: 'success', message: 'Seller updated successfully', data: seller });
    } catch (err) {
        return handleError(res, err);
    }
};

// Delete a seller by ID
const deleteSellerById = async (req, res) => {
    try {
        const seller = req.user
        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        await Seller.findByIdAndDelete(req.user.seller);

        const data = {
            username: seller.fullName,
            subject: 'Seller account deleted - SwiftMarket'
        };

        await sendEmail(seller.businessEmail, data, './userActions/sellerAccountDeleted.hbs');

        res.status(200).json({ status: 'success', message: 'Seller deleted successfully' });
    } catch (err) {
        return handleError(res, err);
    }
};

// Create product for seller
const createProductForSeller = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                name: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const seller = req.seller;

        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const product = new Product({
            seller: seller._id,
            businessName: seller.businessName,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            imagesUrl: req.body.imagesUrl,
            thumbnailUrl: req.body.thumbnailUrl,
            tags: req.body.tags,
            featured: req.body.featured || false,
            discountedPrice: req.body.discountedPrice,
            faqs: req.body.faqs,
            updatedBy: {
                role: req.user.role,
                userId: req.user._id
            }
        });
        await product.save();

        // Update seller's products array
        seller.productListings.push(product._id);
        await seller.save();

        res.status(200).json({
            status: 'success',
            message: 'Created a new product',
            data: {
                product
            }
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// Update product for seller
const updateProductForSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                name: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const seller = await Seller.findOne({ _id: req.user._id });
        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const product = await Product.findOne({ _id: req.params.productId, seller: seller._id });
        if (!product) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Product not found',
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
        product.updatedBy = {
            role: req.user.role,
            userId: req.user._id
        }

        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: {
                product
            }
        });
    } catch (error) {
        return handleError(res, err);
    }
};

// DELETE a product of a seller
const deleteProductForSeller = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
        if (!product) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        const data = {
            username: product.businessUsername,
            productName: product.productName,
            subject: 'Product Deleted - SwiftMarket'
        };

        await sendEmail(product.businessEmail, data, './userActions/deletedProduct.hbs');

        res.status(200).json({
            status: 'success',
            message: 'Deleted the product'
        });
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = { getSellerProfile, updateSellerById, deleteSellerById, deleteProductForSeller, updateProductForSeller, createProductForSeller, applyForSellerAccount, verifySeller };