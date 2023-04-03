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
        maxlength: 100,
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
        enum: ['user', 'seller', 'admin', 'superadmin', 'root'],
        default: 'user',
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
    ],
    paymentDetails: {
        blockchainWalletAddress: {
            type: String
        },
        paypalAccountEmailAddress: {
            type: String
        },
        card: {
            cardNumber: {
                type: String,
                maxlength: 16
            },
            cardHolderName: {
                type: String,
                maxlength: 50
            },
            expirationDate: {
                type: String,
                validate: /^(0[1-9]|1[0-2])\/\d{4}$/
            },
            cvv: {
                type: String,
                maxlength: 4
            }
        }
    },
    transactionHistory: {
        type: [{ product: String, amount: Number, date: Date }],
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
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    banStatus: {
        isBanned: {
            type: Boolean,
            default: false,
        },
        banExpiresAt: {
            type: Date,
            required: false,
            default: null
        },
    },
    verificationCode: {
        type: String,
        default: null,
    },
    verificationCodeExpiresAt: {
        type: Date,
        default: null,
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

// if user is being banned, remove all existing tokens
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('BanStatus.isBanned') && user.BanStatus.isBanned) {
        user.tokens = [];
    }
    next();
});

// role is set to seller if user is a seller
userSchema.pre('save', async function (next) {
    if (this.isModified('seller') && this.seller) {
        // If the user has a linked seller, set their role to 'seller'
        this.role = 'seller';
    } else if (!this.seller && this.role === 'user') {
        // If the user no longer has a linked seller, set their role back to 'user'
        this.role = 'user';
    }
    next();
});

// if user is being deleted, delete the seller
userSchema.pre('remove', async function (next) {
    const user = this;
    if (user.role === 'seller') {
        await mongoose.model('Seller').findOneAndDelete({ user: user._id });
    }
    next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

    // remove all existing tokens
    user.tokens = [];

    // add the new token
    user.tokens.push({
        token: token,
        expiresAt: Date.now() + parseInt(process.env.JWT_EXPIRY) * 1000
    });

    await user.save();
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
