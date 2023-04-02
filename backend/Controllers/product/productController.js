const Seller = require('../../models/seller/sellerSchema');

const Product = require('../../models/product/productSchema');

// GET all products of a seller by username
exports.getAllProductsOfSellerByUsername = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username }).populate('products');
        if (!seller) {
            return res.status(404).json({
                status: 'error',
                message: 'Seller not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Retrieved all products of the seller',
            data: {
                products: seller.products
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
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
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
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
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
};

// GET a product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: product,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};
