const Seller = require('../../models/seller/sellerSchema');

const Product = require('../../models/product/productSchema');
const handleError = require('../../utils/errorHandler');
const natural = require('natural');

// GET all products of a seller by username
exports.getAllProductsOfSellerByUsername = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username }).populate('productListings');
        if (!seller) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        } else if (!seller.productListings || seller.productListings.length === 0) {
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
                    products: seller.productListings
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
        const product = await Seller.findOne(
            {
                username: req.params.username,
                productListings: {
                    $elemMatch: { _id: req.params.id }
                }
            },
            { 'productListings.$': 1 }
        )
            .populate('productListings')
            .exec();

        if (!product) {
            return handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        const productListing = product.productListings[0];

        res.status(200).json({
            status: 'success',
            message: 'Retrieved the product listing',
            data: {
                productListing,
            },
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
        const query = req.query.search
        const tokenizer = new natural.WordTokenizer();
        let stemmedQuery = tokenizer.tokenize(query.toLowerCase())
            .map(word => natural.PorterStemmer.stem(word))
            .join(' ');
        let tokens = tokenizer.tokenize(query);
        const regexQuery = new RegExp(`^${stemmedQuery.split('').join('.*')}$`, 'i');
        let products;
        products = await Product.find({
            $and: [
                { $text: { $search: stemmedQuery } },
                { isAvailable: true },
                {
                    $or: [
                        { productName: { $regex: regexQuery } },
                        { businessUsername: { $regex: regexQuery } },
                        { category: { $regex: regexQuery } },
                        {
                            $expr: {
                                $gt: [
                                    { $size: { $setIntersection: ['$keywords', tokens] } },
                                    0
                                ]
                            }
                        }
                    ]
                }
            ]
        }).populate({
            path: 'seller',
            select: 'businessName businessEmail businessNumber'
        })
            .sort({ createdAt: -1 });
        if (products.length === 0) {
            console.log('run')
            products = await Product.find({
                $expr: {
                    $gt: [
                        { $size: { $setIntersection: ['$keywords', tokens] } },
                        0
                    ]
                }
            }).populate({
                path: 'seller',
                select: 'businessName businessEmail businessNumber'
            })
                .sort({ createdAt: -1 });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};