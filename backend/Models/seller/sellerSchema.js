const mongoose = require('mongoose');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const sellerSchema = new mongoose.Schema({
    sellerID: {
        type: String,
        unique: true, // Make sellerID unique
        index: true // Add index for faster lookups
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid Email Address'
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: validator.isMobilePhone,
            message: 'Invalid phone number'
        }
    },
    businessName: {
        type: String,
        required: true
    },
    businessRegistrationNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    businessType: {
        type: String,
        required: true,
        enum: ['Retail', 'Wholesale', 'Manufacturing']
    },
    businessAddress: {
        type: String,
        required: true
    },
    businessWebsite: {
        type: String,
        required: true
    },
    taxIDNumber: {
        type: String,
        required: true,
        unique: true
    },
    paymentPreferences: {
        type: String,
        required: true
    },
    blockchainWalletAddress: {
        type: String,
        required: true,
        unique: true
    },
    paypalAccountEmailAddress: {
        type: String,
        required: true,
        unique: true
    },
    productCategories: {
        type: [String],
        required: true
    },
    productListings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    salesHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale'
    }],
    ratingsAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });


// Generate sellerID before saving to the database
sellerSchema.pre('save', function (next) {
    if (!this.sellerID) {
        this.sellerID = uuidv4().toUpperCase();
    }
    next();
});

sellerSchema.post('validate', function (error, doc, next) {
    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        next(new Error(`Validation error: ${validationErrors.join(', ')}`));
    } else {
        next(error);
    }
});

sellerSchema.post('save', function (error, doc, next) {
    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        next(new Error(`Validation error: ${validationErrors.join(', ')}`));
    } else if (error.name === 'MongoError' && error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue)[0];
        next(new Error(`Duplicate key error: ${duplicateKey} already exists`));
    } else {
        next(error);
    }
});

sellerSchema.post('findOneAndUpdate', function (error, doc, next) {
    if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
            (err) => err.message
        );
        next(new Error(`Validation error: ${validationErrors.join(', ')}`));
    } else if (error.name === 'MongoError' && error.code === 11000) {
        const duplicateKey = Object.keys(error.keyValue)[0];
        next(new Error(`Duplicate key error: ${duplicateKey} already exists`));
    } else {
        next(error);
    }
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
