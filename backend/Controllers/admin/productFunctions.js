const Product = require('../../models/product/productSchema');
const Seller = require('../../models/seller/sellerSchema');
const handleError = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');

// Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            status: "success",
            message: "All products retrieved successfully",
            data: {
                products: products,
            },
        });
    } catch (err) {
        return handleError(res, err);
    }
};

// GET all products of a seller by username
const getAllProductsOfSellerByUsername = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ username: req.params.username }).populate('products');
        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
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
        return handleError(res, err);
    }
};

// Get a product by ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Retrieved product successfully',
            data: {
                product: product
            }
        });
    } catch (err) {
        return handleError(res, err);
    }
};


// Update product
const updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const seller = await Seller.findOne({ _id: req.user._id });
        if (!seller) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Seller not found',
            });
        }

        const product = await Product.findOne({ _id: req.params.productId, seller: seller._id });
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

        const data = {
            username: product.fullName,
            productName: product.productName,
            adminUsername: req.user.name,
            updateReason: req.body.updateReason,
            subject: 'Product Updated - SwiftMarket'
        };

        await sendEmail(product.businessEmail, data, './violationOfTerms/productUpdated.hbs');


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


// DELETE product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
        if (!product) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Product not found',
            });
        }

        const data = {
            username: product.fullName,
            productName: product.productName,
            adminUsername: req.user.name,
            deletionDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            timeZone: 'IST',
            violationReason: req.body.violationReason,
            subject: 'Product Deleted - SwiftMarket'
        };

        await sendEmail(product.businessEmail, data, './violationOfTerms/productDeleted.hbs');

        res.status(204).json({
            status: 'success',
            message: 'Product deleted successfully',
            data: null
        });
    } catch (error) {
        return handleError(res, err);
    }
};


module.exports = {
    getAllProducts,
    getAllProductsOfSellerByUsername,
    getProductById,
    updateProduct,
    deleteProduct,
};
