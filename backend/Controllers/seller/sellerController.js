const { validationResult } = require('express-validator');

const Seller = require('../../models/seller/sellerSchema');
const applyForSellerModel = require('../../models/seller/applySellerSchema');
const Product = require('../../models/product/productSchema');
const Order = require('../../models/order/orderSchema');
const sendEmail = require('../../utils/sendEmail');

const handleError = require('../../utils/errorHandler');
const { default: mongoose } = require('mongoose');
const User = require('../../models/auth/userSchema');
const bcrypt = require('bcryptjs');
const RefundRequest = require('../../models/transaction/refundRequestSchema');

// Apply for seller account
const applyForSellerAccount = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }
        // Extract required fields from request body
        const {
            businessNumber,
            businessName,
            businessEmail,
            businessUsername,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            productCategories,
        } = req.body;

        // Check if there is already an existing seller with the same business email or business username
        const existingSeller = await Seller.findOne({
            $or: [
                { businessEmail: businessEmail },
                { businessUsername: businessUsername }
            ]
        });
        if (existingSeller) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'There is already an existing seller with the same business email or business username',
            });
        }

        // Create a new seller instance with required fields
        const newSeller = new applyForSellerModel({
            businessNumber,
            businessEmail,
            businessUsername,
            businessName,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            productCategories,
            user: req.user._id, // Link the seller account to the current user
        });

        // Save the new seller instance to the database
        const savedSeller = await newSeller.save();

        res.status(200).json({
            status: 'success',
            message: 'successfully applied for seller account'
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// Verify a seller
const verifySeller = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    console.log(req.user)
    const { code, paymentPreferences, blockchainWalletAddress, paypalAccountEmailAddress, businessLogo } = req.body;

    try {
        // Find the seller by the verification code
        const seller = req.seller;

        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        if (!seller.verificationStatus) {
            // Check if the verification code is not expired
            if (seller.verificationCodeExpiresAt < Date.now()) {
                // If expired, generate a new code and send an email with the new code
                const newVerificationCode = Math.floor(100000 + Math.random() * 900000);
                seller.verificationCode = newVerificationCode;
                seller.verificationCodeExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // Set new code expiry to 24 hours
                await seller.save();

                const data = {
                    username: seller.fullName,
                    verificationCode: seller.verificationCode,
                    verificationLink: 'https://example.com/verify',
                    subject: 'Verify seller account - SwiftMarket'
                };

                await sendEmail(seller.email, data, './verfication/verficationCode.hbs');

                res.status(200).json({ status: 'success', message: 'Verification code sent' });
            } else {
                if (seller.verificationCode === code) {
                    seller.paymentPreferences = paymentPreferences;
                    seller.blockchainWalletAddress = blockchainWalletAddress;
                    seller.paypalAccountEmailAddress = paypalAccountEmailAddress;
                    seller.businessLogo = businessLogo;
                    seller.verificationStatus = true;
                    seller.verificationCode = null;
                    seller.verificationCodeExpiresAt = null;
                    await seller.save();
                } else {
                    return res.status(412).json({ message: 'Invalid or expired verification code', status: 'success' });
                }
            }
            // Send a success response
            res.status(200).json({ status: 'success', message: 'Seller account verified successfully' });
        } else {
            res.status(411).json({ status: 'error', message: 'Seller account already verified' });
        }
    } catch (err) {
        return handleError(res, err);
    }
};

// seller login
const loginSeller = async (req, res) => {
    try {
        // Find the seller by the verification code
        const seller = await Seller.findOne({ businessEmail: req.params.email });
        const code = req.body.code;
        const password = req.body.password;

        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        if (seller.loginCodeExpiresAt < Date.now()) {
            res.status(400).json({ status: 'error', message: 'Verification code expired' });
        } else {
            if (seller.loginCode === code) {
                const user = await User.findById(seller.user);

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(403).json({ status: 'error', message: 'Invalid credentials' });
                } else {
                    const token = user.tokens[0].token;
                    res.cookie('token', token, {
                        httpOnly: true, // cookie cannot be accessed from client-side scripts
                        secure: process.env.NODE_ENV === 'production', // cookie should only be sent over HTTPS in production
                        sameSite: 'strict', // cookie should only be sent for same-site requests
                        maxAge: 5 * 60 * 60 * 1000 // 5hr
                    });
                    seller.loginCode = null;
                    seller.loginCodeExpiresAt = null;
                    await seller.save();
                    return res.status(200).json({
                        status: 'success', seller: seller, user: {
                            id: user.id,
                            code: user.name,
                            email: user.email,
                            username: user.username,
                            address: user.address,
                            verificationStatus: user.verificationStatus,
                            role: user.role
                        },
                    });
                }
            } else {
                return res.status(412).json({ message: 'Invalid or expired verification code', status: 'error' });
            }
        }
    } catch (err) {
        return handleError(res, err);
    }
}

// check verification code
const checkVerificationCode = async (req, res) => {
    try {
        // Find the seller by the verification code
        const seller = await Seller.findOne({ businessEmail: req.params.email });

        if (!seller) {
            res.status(200).json({ status: 'deny' });
        }

        if (seller.loginCodeExpiresAt < Date.now() || seller.loginCode === null || seller.loginCode === "") {
            res.status(412).json({ status: 'error', message: 'Access Denied' });
        } else {
            res.status(200).json({ status: 'allow' });
        }


    } catch (err) {
        // res.status(200).json({ status: 'deny' });
    }
}


// Get a seller by ID
const getSellerProfile = async (req, res) => {
    try {
        res.status(200).json({ status: 'success', data: req.seller });
    } catch (err) {
        return handleError(res, err);
    }
};

// Update a seller by ID
const updateSellerById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    try {
        let seller = req.seller;

        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const {
            businessUsername,
            businessEmail,
            businessRegistrationNumber,
            businessNumber,
            businessName,
            businessLogo,
            businessType,
            businessWebsite,
            taxIDNumber,
            productCategories,
            businessAddress,
        } = req.body;

        const sellerFields = {};
        if (businessEmail) sellerFields.businessEmail = businessEmail;
        if (businessNumber) sellerFields.businessNumber = businessNumber;
        if (businessName) sellerFields.businessName = businessName;
        if (businessUsername) sellerFields.businessUsername = businessUsername;
        if (businessLogo) sellerFields.businessLogo = businessLogo;
        if (businessRegistrationNumber) sellerFields.businessRegistrationNumber = businessRegistrationNumber;
        if (businessType) sellerFields.businessType = businessType;
        if (businessAddress) sellerFields.businessAddress = businessAddress;
        if (businessWebsite) sellerFields.businessWebsite = businessWebsite;
        if (taxIDNumber) sellerFields.taxIDNumber = taxIDNumber;
        if (productCategories) sellerFields.productCategories = productCategories;


        if (toString(seller.user._id) !== toString(req.user._id)) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        seller = await Seller.findByIdAndUpdate(seller._id, { $set: sellerFields }, { new: true });

        res.status(200).json({ status: 'success', message: 'Seller updated successfully', seller: seller });
    } catch (err) {
        return handleError(res, err);
    }
};

// Delete a seller by ID
const deleteSellerById = async (req, res) => {
    try {
        const seller = req.seller
        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        await Seller.deleteOne({ _id: seller._id });
        req.user.role = "user";
        await req.user.save();

        const data = {
            username: seller.fullName,
            subject: 'Seller account deleted - SwiftMarket'
        };

        await sendEmail(seller.businessEmail, data, './userActions/sellerAccountDeleted.hbs');

        res.status(200).json({ status: 'success', message: 'Seller deleted successfully' });
    } catch (err) {
        return handleError(res, err);
    }
};

// Create product for seller
const createProductForSeller = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const seller = req.seller;

        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const product = new Product({
            seller: seller._id,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            imagesUrl: req.body.imagesUrl,
            thumbnailUrl: req.body.thumbnailUrl,
            tags: req.body.tags,
            discountedPrice: req.body.discountedPrice,
            faqs: req.body.faqs,
            updatedBy: {
                role: req.user.role,
                userId: req.user._id
            }
        });
        await product.save();

        // Update seller's products array
        seller.productListings.push(product._id);
        await seller.save();

        res.status(200).json({
            status: 'success',
            message: 'Created a new product',
            _id: product._id
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// get seller products
const getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.seller._id }).sort({ views: -1 });
        res.status(200).json({ status: 'success', products: products });
    } catch (err) {
        return handleError(res, err);
    }
};

// Update product for seller
const updateProductForSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const seller = req.seller;
        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const product = await Product.findOne({ _id: req.body.productId, seller: seller._id });
        if (!product) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        product.productName = req.body.productName;
        product.productDescription = req.body.productDescription;
        product.price = req.body.price;
        product.discountedPrice = req.body.discountedPrice;
        product.quantity = req.body.quantity;
        product.category = req.body.category;
        product.imagesUrl = req.body.imagesUrl;
        product.thumbnailUrl = req.body.thumbnailUrl;
        product.tags = req.body.tags;
        product.faqs = req.body.faqs;
        product.keywords = req.body.keywords;
        product.updatedBy = {
            role: req.user.role,
            userId: req.user._id
        }

        await product.save();
        console.log(product)

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: {
                product
            }
        });
    } catch (error) {
        console.log(error)
        return handleError(res, error);
    }
};

// DELETE a product of a seller
const deleteProductForSeller = async (req, res) => {
    try {
        console.log(req.body)
        const product = await Product.findOneAndDelete({ _id: req.body._id, seller: req.seller._id });
        if (!product) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Deleted the product'
        });

        const data = {
            username: product.seller.businessUsername,
            productName: product.productName,
            subject: 'Product Deleted - SwiftMarket'
        };

        await sendEmail(product.seller.businessEmail, data, './userActions/deletedProduct.hbs');

    } catch (err) {
        return handleError(res, err);
    }
};

// get dashboard data
const getDashboardData = async (req, res) => {
    const sellerId = req.user.seller;
    const { from, to } = req.query;

    const today = new Date();
    const startDate = from ? new Date(from) : new Date(today.getFullYear(), today.getMonth(), 2);
    const endDate = to ? new Date(to) : new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    try {
        const orderTotal = await Order.aggregate([
            {
                $match: {
                    seller: mongoose.Types.ObjectId(sellerId),
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$orderTotal" },
                    count: { $sum: 1 }
                },
            },
        ]);

        const newCustomers = await Order.distinct("customer", {
            seller: mongoose.Types.ObjectId(sellerId),
            createdAt: { $gte: startDate, $lte: endDate },
        });

        const returningCustomers = await Order.distinct("customer", {
            seller: mongoose.Types.ObjectId(sellerId),
            createdAt: { $lt: startDate },
        });

        const retentionRate =
            returningCustomers.length > 0
                ? ((newCustomers.length / returningCustomers.length) * 100).toFixed(2)
                : 0;

        const totalOrders = await Order.countDocuments({
            seller: mongoose.Types.ObjectId(sellerId),
            createdAt: { $gte: startDate, $lte: endDate },
        });

        const newCustomersThisMonth = newCustomers.filter(
            (customer) => !returningCustomers.includes(customer)
        );

        const avgOrderValue = (orderTotal.length > 0 && orderTotal[0].total) ? (orderTotal[0].total / totalOrders).toFixed(2) : 0;

        const avgOrderSize = (orderTotal.length > 0 && orderTotal[0].count) ? (orderTotal[0].count / totalOrders).toFixed(0) : 0;


        const productListings = await Product.aggregate([
            {
                $match: {
                    seller: mongoose.Types.ObjectId(sellerId),
                },
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            },
        ]);

        const conversionRate = (totalOrders > 0) ? ((totalOrders / productListings[0].totalViews) * 100).toFixed(2) : 0;

        const topSellingProducts = await Order.aggregate([
            {
                $match: {
                    seller: mongoose.Types.ObjectId(sellerId),
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: "$products.product",
                    totalSales: { $sum: "$products.price" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $project: {
                    "product.productlistings._id": 0,
                    "product.productlistings.__v": 0,
                    "product.productlistings.createdAt": 0,
                    "product.productlistings.updatedAt": 0
                }
            },
            {
                $sort: {
                    totalSales: -1
                }
            },
            {
                $limit: 5
            }
        ]);


        res.status(200).json({
            orderTotal: orderTotal.length > 0 ? orderTotal[0].total : 0,
            newCustomers: newCustomersThisMonth.length,
            returningCustomers: returningCustomers.length,
            retentionRate: retentionRate,
            totalOrders: totalOrders,
            avgOrderValue: avgOrderValue,
            avgOrderSize: avgOrderSize,
            conversionRate: conversionRate,
            totalViews: productListings.length > 0 ? productListings[0].totalViews : 0,
            topSellingProducts: topSellingProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// get sales data
const getSalesData = async (req, res) => {
    const sellerId = req.user.seller;
    const today = new Date();
    const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
    const firstDayOfSixMonthsAgo = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1);

    try {
        const salesData = await Order.aggregate([
            {
                $match: {
                    seller: mongoose.Types.ObjectId(sellerId),
                    createdAt: { $gte: firstDayOfSixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    sales: { $sum: "$orderTotal" },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    year: "$_id.year",
                    sales: "$sales",
                    count: "$count",
                },
            },
            {
                $sort: {
                    year: 1,
                    month: 1,
                },
            },
        ]);

        const labels = [];
        const sales = [];
        const counts = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
            const year = date.getFullYear();
            const monthData = salesData.find((d) => d.month === date.getMonth() + 1 && d.year === year);
            labels.unshift(`${monthName} ${year}`);
            sales.unshift(monthData ? monthData.sales : 0);
            counts.unshift(monthData ? monthData.count : 0);
        }

        res.status(200).json({
            labels,
            sales,
            counts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// get orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.seller })
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getOrdersById = async (req, res) => {
    try {
        const id = req.params.orderId;
        const order = await Order.find({ orderId: id }).populate('products.product')
            .sort({ createdAt: -1 });

        res.status(200).json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateOrderStatus = async (req, res) => {
    const { _id, newStatus } = req.body;

    try {
        console.log(newStatus)
        const updatedOrder = await Order.findByIdAndUpdate(_id, { orderStatus: newStatus }, { new: true }).populate('products.product');
        console.log(updateOrderStatus)
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const acceptOrder = async (req, res) => {
    const { _id } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(_id, { orderStatus: "Confirmed" }, { new: true }).populate(['customer', 'products.product']);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order accepted successfully', order: updatedOrder });

        const data = {
            order: updatedOrder,
            subject: 'Order Confirmed - SwiftMarket'
        };

        await sendEmail(updatedOrder.customer.email, data, './seller/confirmedOrder.hbs');

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const cancelOrder = async (req, res) => {
    const { _id, reason } = req.body;

    try {
        const updatedOrder = await Order.findById(_id).populate('customer');
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        updatedOrder.orderStatus = "Cancelled"
        updatedOrder.notes.cancelOrderReason = reason;
        await updatedOrder.save();
        // Create and save a new refund request
        const refundRequest = new RefundRequest({
            transactionId: updatedOrder.transactionId,
            reason: reason,
            amount: updatedOrder.orderTotal,
            seller: updatedOrder.seller,
            customer: updatedOrder.customer,
            status: 'Pending',
            orderId: updatedOrder._id
        });
        await refundRequest.save();

        const data = {
            orderNumber: updatedOrder._id,
            reason: reason,
            subject: 'Order Cancelled - SwiftMarket'
        };

        await sendEmail(updatedOrder.customer.email, data, './seller/cancelOrder.hbs');

        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }

}

const addTrackingDetails = async (req, res) => {
    const { _id, carrierName, trackingNumber, trackingUrl, deliveryDate, deliveryStatus } = req.body;

    try {
        // Check if tracking details with given ID exists
        const orderDetails = await Order.findById(_id).populate('products.product');
        if (!orderDetails) {
            return res.status(404).json({ error: 'Tracking details not found' });
        }

        // Update tracking details
        orderDetails.trackingDetails.carrierName = carrierName || orderDetails.trackingDetails.carrierName;
        orderDetails.trackingDetails.trackingNumber = trackingNumber || orderDetails.trackingDetails.trackingNumber;
        orderDetails.trackingDetails.trackingUrl = trackingUrl || orderDetails.trackingDetails.trackingUrl;
        orderDetails.trackingDetails.deliveryDate = deliveryDate || orderDetails.trackingDetails.deliveryDate;
        orderDetails.trackingDetails.deliveryStatus = deliveryStatus || orderDetails.trackingDetails.deliveryStatus;

        // Save updated tracking details to database
        await orderDetails.save();

        console.log(orderDetails)

        return res.status(200).json({ message: 'Tracking details updated successfully', order: orderDetails });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// GET a product by ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return handleError(res, {
                code: "not_found",
                status: "error",
                message: "Product not found",
            });
        }
        // Send the response to the client
        res.status(200).json({
            status: "success",
            product: product,
        });
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = { checkVerificationCode, getProductById, getSellerProducts, acceptOrder, addTrackingDetails, cancelOrder, updateOrderStatus, getOrdersById, loginSeller, getOrders, getSalesData, getDashboardData, getSellerProfile, updateSellerById, deleteSellerById, deleteProductForSeller, updateProductForSeller, createProductForSeller, applyForSellerAccount, verifySeller };