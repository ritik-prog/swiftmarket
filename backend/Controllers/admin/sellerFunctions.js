const { validationResult } = require('express-validator');

const User = require('../../models/auth/userSchema');
const Seller = require('../../models/seller/sellerSchema');
const applySeller = require('../../models/seller/applySellerSchema');
const sendEmail = require('../../utils/sendEmail');
const handleError = require('../../utils/errorHandler');
const generateCode = require('../../utils/generateCode');

// Get applied sellers
const getAllApplySellers = async (req, res, next) => {
    try {
        const applySellers = await applySeller.find().populate('user', 'fullName email'); // populate the user field with only fullName and email

        res.status(200).json({
            success: true,
            message: 'All apply sellers retrieved successfully',
            data: applySellers,
        });
    } catch (error) {
        return handleError(res, err);
    }
};

// Accept seller
const acceptSeller = async (req, res, next) => {
    try {
        // Find the seller application to be approved
        const newSellerApplication = await applySeller.findById(req.params.id);

        if (!newSellerApplication) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller application not found',
            });
        }

        // Create a new seller instance with required fields
        const newSeller = new Seller({
            businessUsername: newSellerApplication.businessUsername,
            businessNumber: newSellerApplication.businessNumber,
            businessEmail: newSellerApplication.businessEmail,
            businessName: newSellerApplication.businessName,
            businessRegistrationNumber: newSellerApplication.businessRegistrationNumber,
            businessType: newSellerApplication.businessType,
            businessAddress: newSellerApplication.businessAddress,
            businessWebsite: newSellerApplication.businessWebsite,
            taxIDNumber: newSellerApplication.taxIDNumber,
            productCategories: newSellerApplication.productCategories,
            user: newSellerApplication.user._id,
        });

        // Save the new seller instance to the database
        const savedSeller = await newSeller.save();

        // Remove the seller application from the applySellerSchema
        await newSellerApplication.remove();

        // Update user in the application
        const user = await User.findById(newSeller.user._id);
        user.seller = newSeller._id;
        user.role = "seller";
        await user.save();

        const verificationCode = generateCode();
        const codeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

        newSeller.verificationCode = verificationCode;
        newSeller.verificationCodeExpiresAt = codeExpiry;
        await newSeller.save();

        const data = {
            subject: 'New Seller Account - SwiftMarket',
            username: newSeller.businessName,
            verificationCode: newSeller.verificationCode,
            verificationLink: 'https://example.com/verify'
        };

        await sendEmail(newSeller.businessEmail, data, './verification/verifySeller.hbs');

        res.status(201).json({
            success: true,
            message: 'Seller account created successfully',
            data: savedSeller,
            subject: 'New Seller Account - SwiftMarket'
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// Get All Verfied sellers
const getAllSellers = async (req, res, next) => {
    try {
        const sellers = await Seller.find().populate('user', 'fullName email'); // populate the user field with only fullName and email

        res.status(200).json({
            success: true,
            message: 'All apply sellers retrieved successfully',
            data: sellers,
        });
    } catch (error) {
        return handleError(res, err);
    }
};

// Create a new seller
const createSeller = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        let seller = await Seller.findOne({ businessEmail: req.body.businessEmail });
        if (seller) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'Seller already exists',
            });
        }

        const {
            businessUsername,
            businessName,
            businessNumber,
            businessEmail,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            paymentPreferences,
            blockchainWalletAddress,
            paypalAccountEmailAddress,
            productCategories
        } = req.body;

        seller = new Seller({
            businessUsername,
            businessEmail,
            businessNumber,
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
            user: user._id
        });

        await seller.save();
        user.seller = seller._id;
        await user.save();
        const data = {
            newSeller: {
                businessUsername: seller.businessUsername,
                email: seller.businessEmail
            },
            subject: 'New Seller Account - SwiftMarket'
        };

        await sendEmail(seller.businessEmail, data, './violationOfTerms/sellerTerms.hbs');

        res.status(200).json({ status: 'success', message: 'Seller created', seller });
    } catch (err) {
        return handleError(res, err);
    }

};

// Update seller
const updateSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const updates = req.body;

        // check if seller exists
        const seller = await Seller.findById(id);
        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        // update seller information
        Object.keys(updates).forEach((key) => (seller[key] = updates[key]));
        await seller.save();

        const data = {
            sellerUpdated: {
                code: seller.businessName,
                email: seller.businessEmail
            },
            violation: {
                code: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.fullname,
            },
            subject: 'Seller Updated - SwiftMarket'
        };

        await sendEmail(seller.businessEmail, data, './violationOfTerms/sellerTerms.hbs');

        res.status(200).json({ status: 'success', message: 'Seller updated successfully', data: seller });
    } catch (err) {
        return handleError(res, err);
    }
};

// Delete seller
const deleteSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findByIdAndDelete(id);

        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const data = {
            sellerDeleted: {
                code: seller.businessName,
                email: seller.businessEmail
            },
            violation: {
                code: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.fullname,
            },
            subject: 'Seller Account Deleted - SwiftMarket'
        };

        await sendEmail(seller.businessEmail, data, './violationOfTerms/sellerTerms.hbs');

        res.status(200).json({ status: 'success', message: 'Seller deleted successfully' });
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = { getAllApplySellers, acceptSeller, getAllSellers, createSeller, updateSeller, deleteSeller }