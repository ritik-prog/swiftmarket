const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 20,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 50,
    },
    address: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    verificationStatus: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    paymentDetails: {
        type: Map,
        of: String,
        maxlength: 10,
    },
    transactionHistory: {
        type: [{ product: String, amount: Number, date: Date }],
        maxlength: 50,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    productListing: {
        type: [{ product: String, price: Number, available: Boolean }],
        maxlength: 50,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
