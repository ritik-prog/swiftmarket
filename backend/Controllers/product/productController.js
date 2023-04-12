const Seller = require("../../models/seller/sellerSchema");

const Product = require("../../models/product/productSchema");
const handleError = require("../../utils/errorHandler");
const natural = require("natural");
const Search = require("../../models/search/searchSchema");

// GET all products of a seller by username
exports.getAllProductsOfSellerByUsername = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({
            username: req.params.username,
        }).populate("productListings");
        if (!seller) {
            return handleError(res, {
                name: "not_found",
                status: "error",
                message: "Seller not found",
            });
        } else if (!seller.productListings || seller.productListings.length === 0) {
            return handleError(res, {
                name: "not_found",
                status: "error",
                message: "No products found for the seller",
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "Retrieved all products of the seller",
                data: {
                    products: seller.productListings,
                },
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
                    $elemMatch: { _id: req.params.id },
                },
            },
            { "productListings.$": 1 }
        )
            .populate("productListings")
            .exec();

        if (!product) {
            return handleError(res, {
                name: "not_found",
                status: "error",
                message: "Product not found",
            });
        }

        const productListing = product.productListings[0];

        res.status(200).json({
            status: "success",
            message: "Retrieved the product listing",
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
                name: "not_found",
                status: "error",
                message: "Product not found",
            });
        }
        // Send the response to the client
        res.status(200).json({
            status: "success",
            data: product,
        });

        // Increment the views count for the product
        await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    } catch (err) {
        return handleError(res, err);
    }
};


// Predict the top 10 most popular products in a category
exports.getTopProductsInCategory = async (req, res) => {
    try {
        const { category, numProducts = 10 } = req.body;

        const products = await Product.find({ category })
            .sort({ popularityScore: -1 })
            .limit(numProducts);

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Predict the top most popular product
exports.getTopProducts = async (req, res) => {
    try {
        const numProducts = req.query.limit || 10;
        console.log(numProducts);
        const products = await Product.find({})
            .sort({ popularityScore: -1 })
            .limit(numProducts);

        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




// search products from dynamic filters
// exports.searchProductsByFilters = async (req, res, next) => {
//     try {
//         const query = req.query.search
//         const tokenizer = new natural.WordTokenizer();
//         let stemmedQuery = tokenizer.tokenize(query.toLowerCase())
//             .map(word => natural.PorterStemmer.stem(word))
//             .join(' ');
//         let tokens = tokenizer.tokenize(query);
//         const regexQuery = new RegExp(`^${stemmedQuery.split('').join('.*')}$`, 'i');
//         let products;
//         const sellerQuery = {
//             $text: { $search: stemmedQuery }
//         };
//         const sellers = await Seller.find(sellerQuery);
//         products = await Product.find({
//             $and: [
//                 { $text: { $search: stemmedQuery } },
//                 { isAvailable: true },
//                 {
//                     $or: [
//                         { productName: { $regex: regexQuery } },
//                         { productDescription: { $regex: regexQuery } },
//                         { category: { $regex: regexQuery } },
//                         {
//                             $expr: {
//                                 $gt: [
//                                     { $size: { $setIntersection: ['$keywords', tokens] } },
//                                     0
//                                 ]
//                             }
//                         }
//                     ]
//                 }
//             ]
//         }).populate({
//             path: 'seller',
//             select: 'businessName businessEmail businessNumber'
//         })
//             .sort({ createdAt: -1 });
//         if (products.length === 0) {
//             console.log('run')
//             products = await Product.find({
//                 $expr: {
//                     $gt: [
//                         { $size: { $setIntersection: ['$keywords', tokens] } },
//                         0
//                     ]
//                 }
//             }).populate({
//                 path: 'seller',
//                 select: 'businessName businessEmail businessNumber'
//             })
//                 .sort({ createdAt: -1 });
//         }
//         res.status(200).json({ products, sellers });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

exports.searchProductsByKeywords = async (req, res, next) => {
    try {
        const query = req.query.search;
        const tokenizer = new natural.WordTokenizer();
        let stemmedQuery = tokenizer
            .tokenize(query.toLowerCase())
            .map((word) => natural.PorterStemmer.stem(word))
            .join(" ");
        let tokens = tokenizer.tokenize(query);
        let products;
        const sellerQuery = {
            $text: { $search: stemmedQuery },
        };
        const sellers = await Seller.find(sellerQuery).sort({
            ratingsAvg: -1,
        });
        const dbquery = { isAvailable: true };

        if (query) {
            const searchRegex = new RegExp(stemmedQuery | query, "i");
            dbquery.$or = [
                { productName: searchRegex },
                { productDescription: searchRegex },
                { category: searchRegex },
                { tags: searchRegex },
                { keywords: searchRegex },
            ];
        }

        products = await Product.find(dbquery)
            .populate({
                path: "seller",
                select: "businessName businessEmail businessNumber",
            })
            .sort({
                popularityScore: -1,
                ratingsAvg: -1,
                featured: -1,
                views: -1,
                likes: -1,
            });

        if (products.length === 0) {
            products = await Product.find({
                $expr: {
                    $gt: [{ $size: { $setIntersection: ["$keywords", tokens] } }, 0],
                },
            })
                .populate({
                    path: "seller",
                    select: "businessName businessEmail businessNumber",
                })
                .sort({ createdAt: -1 });
        }
        res.status(200).json({ products, sellers });

        const searchQuery = new Search({
            query: query,
            userIdentifier: {
                userId: req.user ? req.user._id : null,
                sessionId: req.cookies.uid,
            },
            timestamp: Date.now(),
        });

        searchQuery
            .save()
            .then(() => {
                console.log("Search query saved successfully");
            })
            .catch((error) => {
                console.error("Error saving search query: ", error);
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        // Get the user's id from the session or request
        const userId = req.user?._id || "";
        const sessionId = req.cookies.uid;
        const limit = req.query.limit || 4;

        let searchQuery;
        // Get the user's search history
        if (!userId && !sessionId) {
            return res.status(200).json({ products: [] });
        } else if (req.cookies.uid) {
            searchQuery = { sessionId: sessionId };
        } else if (userId) {
            searchQuery = {
                userId: userId,
            };
        } else {
            searchQuery = {
                $or: [{ sessionId: sessionId }, { userId: userId }],
            };
        }
        const searches = await Search.find(searchQuery)
            .sort({ timestamp: -1 })
            .limit(1);

        // Get all the products that match any of the user's search queries
        const query = searches[0].query;
        const tokenizer = new natural.WordTokenizer();
        let stemmedQuery = tokenizer
            .tokenize(query.toLowerCase())
            .map((word) => natural.PorterStemmer.stem(word))
            .join(" ");
        let tokens = tokenizer.tokenize(query);
        let products;
        const sellerQuery = {
            $text: { $search: stemmedQuery },
        };
        const sellers = await Seller.find(sellerQuery).sort({
            ratingsAvg: -1,
        });
        const dbquery = { isAvailable: true };

        if (query) {
            const searchRegex = new RegExp(stemmedQuery | query, "i");
            dbquery.$or = [
                { productName: searchRegex },
                { productDescription: searchRegex },
                { category: searchRegex },
                { tags: searchRegex },
                { keywords: searchRegex },
            ];
        }

        products = await Product.find(dbquery)
            .populate({
                path: "seller",
                select: "businessName businessEmail businessNumber",
            })
            .limit(limit)
            .sort({
                ratingsAvg: -1,
                featured: -1,
                views: -1,
                likes: -1,
            });

        if (products.length === 0) {
            products = await Product.find({
                $expr: {
                    $gt: [{ $size: { $setIntersection: ["$keywords", tokens] } }, 0],
                },
            })
                .populate({
                    path: "seller",
                    select: "businessName businessEmail businessNumber",
                })
                .limit(limit)
                .sort({ createdAt: -1 });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
