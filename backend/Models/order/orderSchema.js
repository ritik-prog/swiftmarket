const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Product = require('../product/productSchema');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    cartId: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
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
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
        },
    ],
    orderStatus: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Payment Failed', 'Cancelled'],
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
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
    },
    orderAmount: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    orderTotal: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

// Generate sellerID before saving to the database
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = `order_${Date.now()}_${uuidv4()}`;
    }
    next();
});

// Save order ID to seller's orders array
orderSchema.pre('save', async function (next) {
    try {
        const Seller = mongoose.model('Seller');
        const seller = await Seller.findOne({ sellerID: this.sellerID });
        seller.orders.push(this._id);
        await seller.save();
        const data = {
            sellerName: seller.businessName,
            subject: 'New Order - SwiftMarket'
        };
        // Send email
        sendEmail(seller.businessEmail, data, './order/informSeller.hbs');
        next();
    } catch (error) {
        next(error);
    }
});

// desrease quantity of product
orderSchema.pre('save', async function (next) {
    try {
        const products = this.products;
        let orderAmount = 0;
        let totalDiscount = 0;
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].product);
            if (product) {
                product.quantity -= products[i].quantity;
                await product.save();

                const price = product.price;
                const discountedPrice = product.discountedPrice || price;
                const quantity = products[i].quantity;

                orderAmount += price * quantity;
                totalDiscount += (price - discountedPrice) * quantity;
            }

            this.orderAmount = orderAmount;
            this.totalDiscount = totalDiscount;
            this.orderTotal = orderAmount - totalDiscount;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Order', orderSchema);