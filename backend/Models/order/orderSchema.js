const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    products: [
        {
            productName: {
                type: String,
                required: true,
            },
            productPrice: {
                type: Number,
                required: true,
            },
            productQuantity: {
                type: Number,
                required: true,
            },
        }
    ],
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'Paypal', 'Bitcoin'],
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered'],
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
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    estimatedDeliveryDate: {
        type: Date,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
});

orderSchema.pre('save', function (next) {
    if (!this.estimatedDeliveryDate) {
        this.estimatedDeliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    next();
});

orderSchema.statics.getOrderById = async function (id) {
    const order = await this.findById(id).populate('seller', 'firstName lastName email').populate('customer', 'firstName lastName email');
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

orderSchema.methods.toJSON = function () {
    const order = this.toObject();
    delete order.__v;
    return order;
};

module.exports = mongoose.model('Order', orderSchema);
