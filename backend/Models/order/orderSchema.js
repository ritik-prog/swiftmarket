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
    shippingAddress: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered'],
        required: true,
        default: 'Placed',
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
    },
    subOrders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubOrder',
            required: true,
        }
    ],
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
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

orderSchema.pre('save', function (next) {
    if (!this.estimatedDeliveryDate) {
        this.estimatedDeliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    next();
});

orderSchema.statics.getOrderById = async function (id) {
    const order = await this.findById(id)
        .populate('customer', 'firstName lastName email')
        .populate('subOrders.seller', 'businessName businessNumber businessEmail sellerID')
        .populate('subOrders.products', 'productName productPrice productQuantity seller');
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