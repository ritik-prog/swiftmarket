const Seller = require('../../models/seller/sellerSchema');

const Product = require('../../models/product/productSchema');
const handleError = require('../../data/errorCode');

// GET all products of a seller by username
exports.getAllProductsOfSellerByUsername = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username }).populate('products');
        if (!seller) {
            handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        } else if (!seller.products || seller.products.length === 0) {
            handleError(res, {
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
        handleError(res, err);
    }
};

// GET a specific product of a seller
exports.getSellerProduct = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username });
        if (!seller) {
            return res.status(404).json({
                status: 'error',
                message: 'Seller not found'
            });
        }
        const product = await Product.findOne({ _id: req.params.id, seller: seller._id });
        if (!product) {
            handleError(res, {
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
        handleError(res, err);
    }
};

// GET a product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            handleError(res, {
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
        handleError(res, err);
    }
};
