const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    type: {
        type: String,
        enum: ['payment', 'refund'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit card', 'debit card', 'paypal'],
        required: true
    },
    paymentDetails: {
        type: Object,
        required: true
    },
    refundReason: {
        type: String,
        required: function () {
            return this.type === 'refund';
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

transactionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

transactionSchema.path('user').validate(function (value, respond) {
    if (value === this.seller) {
        return respond(false);
    }
    return respond(true);
}, 'User and seller cannot be the same.');

transactionSchema.path('order').validate(function (value, respond) {
    if (value.user !== this.user) {
        return respond(false);
    }
    return respond(true);
}, 'Order does not belong to user.');

transactionSchema.path('paymentMethod').validate(function (value, respond) {
    const validMethods = ['credit card', 'debit card', 'paypal'];
    if (validMethods.indexOf(value) === -1) {
        return respond(false);
    }
    return respond(true);
}, 'Invalid payment method.');

module.exports = mongoose.model('Transaction', transactionSchema);