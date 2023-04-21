const { validationResult } = require('express-validator');

const Seller = require('../../models/seller/sellerSchema');
const applyForSellerModel = require('../../models/seller/applySellerSchema');
const Product = require('../../models/product/productSchema');
const Order = require('../../models/order/orderSchema');
const sendEmail = require('../../utils/sendEmail');

const handleError = require('../../utils/errorHandler');
const { default: mongoose } = require('mongoose');
const User = require('../../models/auth/userSchema');

// Apply for seller account
const applyForSellerAccount = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                name: 'CustomValidationError',
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
                name: 'already_exists',
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
            message: 'successfully applied for seller account',
            data: savedSeller,
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
            name: 'CustomValidationError',
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
                name: 'not_found',
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

        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        if (seller.loginCodeExpiresAt < Date.now()) {
            res.status(400).json({ status: 'error', message: 'Verification code expired' });
        } else {
            if (seller.loginCode === code) {
                seller.loginCode = null;
                seller.loginCodeExpiresAt = null;
                await seller.save();
                const user = await User.findById(seller.user);

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(403).json({ status: 'error', message: 'Invalid credentials' });
                } else {
                    const token = await user.generateAuthToken();
                    res.cookie('token', token, {
                        httpOnly: true, // cookie cannot be accessed from client-side scripts
                        secure: process.env.NODE_ENV === 'production', // cookie should only be sent over HTTPS in production
                        sameSite: 'strict', // cookie should only be sent for same-site requests
                        maxAge: 5 * 60 * 60 * 1000 // 5hr
                    });
                }
                return res.status(200).json({ status: 'success', seller: seller });
            } else {
                return res.status(412).json({ message: 'Invalid or expired verification code', status: 'error' });
            }
        }
    } catch (err) {
        return handleError(res, err);
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
            name: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    try {
        let seller = await Seller.findById(req.params.id);

        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }



        const {
            fullName,
            email,
            phoneNumber,
            businessName,
            businessRegistrationNumber,
            businessType,
            businessAddress,
            businessWebsite,
            taxIDNumber,
            paymentPreferences,
            blockchainWalletAddress,
            paypalAccountEmailAddress,
            productCategories,
            productListings,
            salesHistory,
            ratingsAndReviews
        } = req.body;

        const sellerFields = {};
        if (fullName) sellerFields.fullName = fullName;
        if (email) sellerFields.email = email;
        if (phoneNumber) sellerFields.phoneNumber = phoneNumber;
        if (businessName) sellerFields.businessName = businessName;
        if (businessRegistrationNumber) sellerFields.businessRegistrationNumber = businessRegistrationNumber;
        if (businessType) sellerFields.businessType = businessType;
        if (businessAddress) sellerFields.businessAddress = businessAddress;
        if (businessWebsite) sellerFields.businessWebsite = businessWebsite;
        if (taxIDNumber) sellerFields.taxIDNumber = taxIDNumber;
        if (paymentPreferences) sellerFields.paymentPreferences = paymentPreferences;
        if (blockchainWalletAddress) sellerFields.blockchainWalletAddress = blockchainWalletAddress;
        if (paypalAccountEmailAddress) sellerFields.paypalAccountEmailAddress = paypalAccountEmailAddress;
        if (productCategories) sellerFields.productCategories = productCategories;
        if (productListings) sellerFields.productListings = productListings;
        if (salesHistory) sellerFields.salesHistory = salesHistory;
        if (ratingsAndReviews) sellerFields.ratingsAndReviews = ratingsAndReviews;


        if (seller.user.toString() !== req.user.id) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        seller = await Seller.findByIdAndUpdate(req.params.id, { $set: sellerFields }, { new: true });

        res.status(200).json({ status: 'success', message: 'Seller updated successfully', data: seller });
    } catch (err) {
        return handleError(res, err);
    }
};

// Delete a seller by ID
const deleteSellerById = async (req, res) => {
    try {
        const seller = req.user
        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        await Seller.findByIdAndDelete(req.user.seller);

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
                name: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const seller = req.seller;

        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const product = new Product({
            seller: seller._id,
            businessName: seller.businessName,
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            imagesUrl: req.body.imagesUrl,
            thumbnailUrl: req.body.thumbnailUrl,
            tags: req.body.tags,
            featured: req.body.featured || false,
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
            data: {
                product
            }
        });
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
                name: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const seller = await Seller.findOne({ _id: req.user._id });
        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const product = await Product.findOne({ _id: req.params.productId, seller: seller._id });
        if (!product) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        product.productName = req.body.productName;
        product.productDescription = req.body.productDescription;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.category = req.body.category;
        product.imagesUrl = req.body.imagesUrl;
        product.thumbnailUrl = req.body.thumbnailUrl;
        product.featured = req.body.featured || false;
        product.updatedBy = {
            role: req.user.role,
            userId: req.user._id
        }

        await product.save();

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: {
                product
            }
        });
    } catch (error) {
        return handleError(res, err);
    }
};

// DELETE a product of a seller
const deleteProductForSeller = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
        if (!product) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        const data = {
            username: product.businessUsername,
            productName: product.productName,
            subject: 'Product Deleted - SwiftMarket'
        };

        await sendEmail(product.businessEmail, data, './userActions/deletedProduct.hbs');

        res.status(200).json({
            status: 'success',
            message: 'Deleted the product'
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// get dashboard data
const getDashboardData = async (req, res) => {
    const sellerId = req.user.seller;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    try {
        const orderTotal = await Order.aggregate([
            {
                $match: {
                    seller: mongoose.Types.ObjectId(sellerId),
                    createdAt: { $gte: firstDayOfMonth },
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
            createdAt: { $gte: firstDayOfMonth },
        });

        const returningCustomers = await Order.distinct("customer", {
            seller: mongoose.Types.ObjectId(sellerId),
            createdAt: { $lt: firstDayOfMonth },
        });

        const retentionRate =
            returningCustomers.length > 0
                ? ((newCustomers.length / returningCustomers.length) * 100).toFixed(2)
                : 0;

        const totalOrders = await Order.countDocuments({
            seller: mongoose.Types.ObjectId(sellerId),
            createdAt: { $gte: firstDayOfMonth },
        });

        const newCustomersThisMonth = newCustomers.filter(
            (customer) => !returningCustomers.includes(customer)
        );

        const avgOrderValue = (orderTotal.length > 0 && orderTotal[0].total) ? (orderTotal[0].total / totalOrders).toFixed(2) : 0;

        const avgOrderSize = (orderTotal.length > 0 && orderTotal[0].count) ? (orderTotal[0].count / totalOrders).toFixed(2) : 0;



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
            }
        ]);

        const conversionRate = (totalOrders > 0) ? ((totalOrders / productListings[0].totalViews) * 100).toFixed(2) : 0;

        const topSellingProducts = await Order.aggregate([
            {
                $match: {
                    seller: mongoose.Types.ObjectId(sellerId),
                    createdAt: { $gte: firstDayOfMonth },
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
                    from: "sellers",
                    localField: "seller",
                    foreignField: "productlistings.product",
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
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
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

        console.log(salesData)

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

module.exports = { loginSeller, getOrders, getSalesData, getDashboardData, getSellerProfile, updateSellerById, deleteSellerById, deleteProductForSeller, updateProductForSeller, createProductForSeller, applyForSellerAccount, verifySeller };