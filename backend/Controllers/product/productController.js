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

// Search products
exports.searchProducts = async (req, res) => {
    const { searchQuery } = req.query;

    try {
        const products = await Product.find({
            $or: [
                { productName: { $regex: searchQuery, $options: 'i' } },
                { 'seller.businessName': { $regex: searchQuery, $options: 'i' } },
                { tags: { $regex: searchQuery, $options: 'i' } },
                { productDescription: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } },
            ],
            isAvailable: true,
        })
            .populate('seller', 'businessName businessEmail businessNumber')
            .exec();

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};
