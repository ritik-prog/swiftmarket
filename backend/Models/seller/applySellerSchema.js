const mongoose = require('mongoose');
const validator = require('validator');

const applySellerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid Email Address',
        },
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: validator.isMobilePhone,
            message: 'Invalid phone number',
        },
    },
    businessName: {
        type: String,
        required: true,
    },
    businessRegistrationNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    businessType: {
        type: String,
        required: true,
        enum: ['Retail', 'Wholesale', 'Manufacturing'],
    },
    businessAddress: {
        type: String,
        required: true,
    },
    businessWebsite: {
        type: String,
        required: true,
    },
    taxIDNumber: {
        type: String,
        required: true,
        unique: true,
    },
    productCategories: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Post save middleware for validation errors
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

module.exports = mongoose.model('applySeller', applySellerSchema);