const User = require('../../Models/auth/userSchema');
const Seller = require('../../Models/seller/sellerSchema');
const { validationResult } = require('express-validator');

const Product = require('../../Models/product/productSchema');

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

module.exports = { getSellerById, updateSellerById, deleteSellerById, deleteProductForSeller, updateProductForSeller, createProductForSeller };