const Product = require('../../models/product/productSchema');

// Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        return products;
    } catch (err) {
        console.error(err);
    }
};

// GET all products of a seller by username
const getAllProductsOfSellerByUsername = async (req, res, next) => {
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

// Get a product by ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.productId);
        return product;
    } catch (err) {
        console.error(err);
    }
};

// Update product
const updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: 'error',
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const seller = await Seller.findOne({ _id: req.user._id });
        if (!seller) {
            return res.status(404).json({
                status: 'error',
                message: 'Seller not found'
            });
        }

        const product = await Product.findOne({ _id: req.params.productId, seller: seller._id });
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
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
            updateReason: req.body.updateReason
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
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

// DELETE product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const data = {
            username: product.fullName,
            productName: product.productName,
            adminUsername: req.user.name,
            deletionDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            timeZone: 'IST',
            violationReason: req.body.violationReason
        };

        await sendEmail(product.businessEmail, data, './violationOfTerms/productDeleted.hbs');

        res.status(204).json({
            status: 'success',
            message: 'Deleted the product'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};


module.exports = {
    getAllProducts,
    getAllProductsOfSellerByUsername,
    getProductById,
    updateProduct,
    deleteProduct,
};
