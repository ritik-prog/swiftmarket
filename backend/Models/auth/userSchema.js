const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const handleError = require('../../utils/errorHandler');

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
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    number: {
        type: String,
        trim: true,
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
        enum: ['user', 'seller', 'ticketmaster', 'admin', 'superadmin', 'root'],
        default: 'user',
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
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
        }
    },
    transactionHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        },
    ],
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
    resetPasswordCode: {
        type: String,
        default: null,
    },
    resetPasswordCodeExpiresAt: {
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
    if (user.isModified('BanStatus.isBanned') && user.banStatus.isBanned) {
        user.tokens = [];
    }
    next();
});

userSchema.pre(['find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete', 'update'], function (next) {
    if (this._conditions.hasOwnProperty('email') || this._conditions.hasOwnProperty('_id')) {
        // if (!this.field || !this.field.includes('password')) {
        //     this.select('-tokens');
        // }
    } else {
        this.select('-password -tokens');
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

// find by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return { token: "", user };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return {
            token: '',
            user: ''
        };
    }

    const token = await user.generateAuthToken();

    return { token, user };
};

// Pre-hook to update seller and product ban status when user is banned
userSchema.pre(["findOneAndUpdate", "updateMany", "update"], async function (next) {
    const query = this.getQuery();
    const docToUpdate = await this.model.findOne(query);

    const isBannedChanged = this._update.banStatus && this._update.banStatus.isBanned !== undefined && this._update.banStatus.isBanned !== docToUpdate.banStatus.isBanned;

    if (isBannedChanged && this._update.banStatus.isBanned) {
        try {
            // Find the associated seller and update their ban status
            const seller = await User.findOne({ sellerId: docToUpdate.sellerId, role: 'seller' });
            if (seller) {
                seller.banStatus.isBanned = true;
                seller.banStatus.banExpiresAt = this._update.banStatus.banExpiresAt;
                await seller.save();
            }

            // Find all products associated with the banned user and set them as unavailable
            await Product.updateMany({ sellerId: docToUpdate.sellerId }, { isAvailable: false });
        } catch (error) {
            console.error('Error updating seller and product ban status: ', error);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
