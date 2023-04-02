const { validationResult } = require('express-validator');

const User = require('../../models/auth/userSchema');
const Seller = require('../../models/seller/sellerSchema');
const applySeller = require('../../models/seller/applySellerSchema');
const sendEmail = require('../../utils/sendEmail');

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
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Accept seller
const acceptSeller = async (req, res, next) => {
    try {
        // Find the seller application to be approved
        const newSellerApplication = await applySeller.findById(req.params.id);

        if (!newSellerApplication) {
            return res.status(404).json({
                success: false,
                message: 'Seller application not found',
            });
        }

        // Create a new seller instance with required fields
        const newSeller = new sellerModel({
            businessUsername: applySeller.businessUsername,
            businessNumber: applySeller.businessNumber,
            businessEmail: applySeller.businessEmail,
            businessName: applySeller.businessName,
            businessRegistrationNumber: applySeller.businessRegistrationNumber,
            businessType: applySeller.businessType,
            businessAddress: applySeller.businessAddress,
            businessWebsite: applySeller.businessWebsite,
            taxIDNumber: applySeller.taxIDNumber,
            productCategories: applySeller.productCategories,
            user: applySeller.user._id,
        });

        // Save the new seller instance to the database
        const savedSeller = await newSeller.save();

        // Remove the seller application from the applySellerSchema
        await newSellerApplication.remove();

        const verificationCode = generateVerificationCode();
        const codeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

        newSeller.verificationCode = verificationCode;
        newSeller.verificationCodeExpiresAt = codeExpiry;
        await newSeller.save();

        const data = {
            username: newSeller.fullName,
            verificationCode: newSeller.verificationCode,
            verificationLink: 'https://example.com/verify'
        };

        await sendEmail(newSeller.email, data, './verfication/verifySeller.hbs');

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
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Create a new seller
const createSeller = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        let seller = await Seller.findOne({ email: req.body.email });
        if (seller) {
            return res.status(409).json({ status: 'error', message: 'Seller already exists' });
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
        res.status(201).json({ status: 'success', message: 'Seller created', seller });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }

};

// Update seller
const updateSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 'fail', message: 'Validation error', errors: errors.array() });
        }

        const { id } = req.params;
        const updates = req.body;

        // check if seller exists
        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({ status: 'fail', message: 'Seller not found' });
        }

        // update seller information
        Object.keys(updates).forEach((key) => (seller[key] = updates[key]));
        await seller.save();

        res.status(200).json({ status: 'success', message: 'Seller updated successfully', data: seller });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// Delete seller
const deleteSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findByIdAndDelete(id);

        if (!seller) {
            return res.status(404).json({ status: 'error', message: 'Seller not found' });
        }

        res.status(200).json({ status: 'success', message: 'Seller deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

module.exports = { getAllApplySellers, acceptSeller, getAllSellers, createSeller, updateSeller, deleteSeller }