const Seller = require('../../models/seller/sellerSchema');

const Product = require('../../models/product/productSchema');
const handleError = require('../../data/errorCode');

// GET all products of a seller by username
exports.getAllProductsOfSellerByUsername = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username }).populate('products');
        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        } else if (!seller.products || seller.products.length === 0) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'No products found for the seller',
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'Retrieved all products of the seller',
                data: {
                    products: seller.products
                }
            });
        }
    } catch (err) {
        return handleError(res, err);
    }
};

// GET a specific product of a seller
exports.getSellerProduct = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username });
        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }
        const product = await Product.findOne({ _id: req.params.id, seller: seller._id });
        if (!product) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Retrieved the product',
            data: {
                product
            }
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// GET a product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: product,
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// Predict the top 10 most popular products in a category
exports.getTopProductsInCategory = async (req, res) => {
    async (req, res) => {
        try {
            const { category, numProducts = 10 } = req.body;

            const products = await Product.aggregate([
                // Match products that belong to the requested category
                { $match: { category } },
                // Calculate popularity score for each product
                {
                    $addFields: {
                        popularityScore: {
                            $add: [
                                { $cond: [{ $eq: ['$featured', true] }, 2, 0] },
                                { $size: '$likes' },
                                '$views',
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                {
                                                    $reduce: {
                                                        input: '$ratings.rating',
                                                        initialValue: 0,
                                                        in: { $add: ['$$value', '$$this'] },
                                                    },
                                                },
                                                { $size: '$ratings' },
                                            ],
                                        },
                                        10,
                                    ],
                                },
                                '$purchaseCount',
                            ],
                        },
                    },
                },

                // Sort products by popularity score in descending order
                { $sort: { popularityScore: -1 } },

                // Limit the number of products to be returned
                { $limit: numProducts },
            ]);

            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
};

// search products from dynamic filters
exports.searchProductsByFilters = async (req, res, next) => {
    try {
        const filterParams = {};
        // Check for category filter
        if (req.query.category) {
            filterParams.category = req.query.category;
        }

        // Check for price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filterParams.price = {};
            if (req.query.minPrice) {
                filterParams.price.$gte = parseFloat(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filterParams.price.$lte = parseFloat(req.query.maxPrice);
            }
        }

        // Check for quantity filter
        if (req.query.minQuantity || req.query.maxQuantity) {
            filterParams.quantity = {};
            if (req.query.minQuantity) {
                filterParams.quantity.$gte = parseInt(req.query.minQuantity);
            }
            if (req.query.maxQuantity) {
                filterParams.quantity.$lte = parseInt(req.query.maxQuantity);
            }
        }

        // Check for purchase count filter
        if (req.query.minPurchaseCount || req.query.maxPurchaseCount) {
            filterParams.purchaseCount = {};
            if (req.query.minPurchaseCount) {
                filterParams.purchaseCount.$gte = parseInt(req.query.minPurchaseCount);
            }
            if (req.query.maxPurchaseCount) {
                filterParams.purchaseCount.$lte = parseInt(req.query.maxPurchaseCount);
            }
        }

        // Check for ratings filter
        if (req.query.minRatings || req.query.maxRatings) {
            filterParams.ratings = {};
            if (req.query.minRatings) {
                filterParams.ratings.$gte = parseFloat(req.query.minRatings);
            }
            if (req.query.maxRatings) {
                filterParams.ratings.$lte = parseFloat(req.query.maxRatings);
            }
        }

        // Check for average ratings filter
        if (req.query.minRatingsAvg || req.query.maxRatingsAvg) {
            filterParams.ratingsAvg = {};
            if (req.query.minRatingsAvg) {
                filterParams.ratingsAvg.$gte = parseFloat(req.query.minRatingsAvg);
            }
            if (req.query.maxRatingsAvg) {
                filterParams.ratingsAvg.$lte = parseFloat(req.query.maxRatingsAvg);
            }
        }

        // Check for featured filter
        if (req.query.featured) {
            filterParams.featured = req.query.featured === 'true';
        }

        // Check for views filter
        if (req.query.minViews || req.query.maxViews) {
            filterParams.views = {};
            if (req.query.minViews) {
                filterParams.views.$gte = parseInt(req.query.minViews);
            }
            if (req.query.maxViews) {
                filterParams.views.$lte = parseInt(req.query.maxViews);
            }
        }

        // Check for likes filter
        if (req.query.minLikes || req.query.maxLikes) {
            filterParams.likes = {};
            if (req.query.minLikes) {
                filterParams.likes.$gte = parseInt(req.query.minLikes);
            }
            if (req.query.maxLikes) {
                filterParams.likes.$lte = parseInt(req.query.maxLikes);
            }
        }

        // Check for availability filter
        if (req.query.isAvailable) {
            filterParams.isAvailable = req.query.isAvailable === 'true';
        }

        // Add search query filter
        if (req.query.search) {
            const query = req.query.search;
            const tokens = query.split(' ');
            const queryObject = {
                $and: [
                    { isAvailable: true },
                    {
                        $or: [
                            { productName: { $regex: query, $options: 'i' } },
                            {
                                businessUsername: { $regex: query, $options: 'i' }
                            },
                            { tags: { $in: tokens } },
                            { $text: { $search: query } },
                            {
                                $expr: {
                                    $gt: [{ $size: { $setIntersection: ['$keywords', tokens] } }, 0]
                                }
                            }
                        ]
                    }
                ]
            };
            filterParams = { ...filterParams, ...queryObject };
        }

        // Execute the search query
        const products = await Product.find(filterParams)
            .populate({
                path: 'seller',
                select: 'businessName businessEmail businessNumber'
            })
            .sort({ createdAt: -1 });

        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}