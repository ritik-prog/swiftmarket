const mongoose = require('mongoose');

const subOrderSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    ],
    orderStatus: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Payment Failed'],
        required: true,
        default: 'Placed',
    },
    trackingDetails: {
        carrierName: {
            type: String,
            required: false,
        },
        trackingNumber: {
            type: String,
            required: false,
        },
        trackingUrl: {
            type: String,
            required: false,
        },
        deliveryDate: {
            type: Date,
            required: false,
        },
        deliveryStatus: {
            type: String,
            required: false,
            enum: ['In Transit', 'Out for Delivery', 'Delivered', 'Exception'],
        },
    },
});

module.exports = mongoose.model('SubOrder', subOrderSchema);