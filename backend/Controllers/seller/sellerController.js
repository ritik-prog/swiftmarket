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

    try {
        let seller = await Seller.findOne({ email });
        if (seller) {
            return res.status(400).json({ msg: 'Seller already exists' });
        }
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
            productListings,
            salesHistory,
            ratingsAndReviews,
            user: user._id
        });

        await seller.save();
        user.seller = seller._id;
        await user.save();
        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all sellers
const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find();
        res.json(sellers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a seller by ID
const getSellerById = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({ msg: 'Seller not found' });
        }
        res.json(seller);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Seller not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Update a seller by ID
const updateSellerById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        sellerID,
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

    // Build seller object
    const sellerFields = {};
    if (sellerID) sellerFields.sellerID = sellerID;
    if (fullName) sellerFields.fullName = fullName;
    if (email) sellerFields.email = email;
    if (phoneNumber) sellerFields.phoneNumber = phoneNumber;
    if (businessName) sellerFields.businessName = businessName;
    if (businessRegistrationNumber)
        sellerFields.businessRegistrationNumber = businessRegistrationNumber;
    if (businessType) sellerFields.businessType = businessType;
    if (businessAddress) sellerFields.businessAddress = businessAddress;
    if (businessWebsite) sellerFields.businessWebsite = businessWebsite;
    if (taxIDNumber) sellerFields.taxIDNumber = taxIDNumber;
    if (paymentPreferences) sellerFields.paymentPreferences = paymentPreferences;
    if (blockchainWalletAddress)
        sellerFields.blockchainWalletAddress = blockchainWalletAddress;
    if (paypalAccountEmailAddress)
        sellerFields.paypalAccountEmailAddress = paypalAccountEmailAddress;
    if (productCategories) sellerFields.productCategories = productCategories;
    if (productListings) sellerFields.productListings = productListings;
    if (salesHistory) sellerFields.salesHistory = salesHistory;
    if (ratingsAndReviews) sellerFields.ratingsAndReviews = ratingsAndReviews;

    try {
        let seller = await Seller.findById(req.params.id);

        if (!seller) return res.status(404).json({ msg: 'Seller not found' });

        // Check if user is authorized to update the seller
        if (seller.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        seller = await Seller.findByIdAndUpdate(
            req.params.id,
            { $set: sellerFields },
            { new: true }
        );

        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteSellerById = async (req, res) => {
    try {
        const seller = await Seller.findByIdAndDelete(req.params.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json({ message: 'Seller deleted successfully', data: seller });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createSeller, getAllSellers, getSellerById, updateSellerById, deleteSellerById };