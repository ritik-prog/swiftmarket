const User = require('../../Models/auth/userSchema');
const Seller = require('../../Models/seller/sellerSchema');
const { validationResult } = require('express-validator');

// Create a new seller
const createSeller = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    var user = await User.findById(req.userId);

    if (!user) {
        throw new Error('User not found');
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
            productCategories
        } = req.body;

        seller = new Seller({
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