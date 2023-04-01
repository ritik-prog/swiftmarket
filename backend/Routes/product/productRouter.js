const express = require('express');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const { getSellerProduct, getAllProductsOfSellerByUsername, getProductById } = require('../../controllers/product/productController');

const router = express.Router();

// GET all products of a seller by username
router.get('/:username/products',
    [authenticateMiddleware],
    getAllProductsOfSellerByUsername
);

// GET a specific product of a seller
router.get('/:username/product/:id', [authenticateMiddleware], getSellerProduct);

// GET a product by ID
router.get('/:id', getProductById);

module.exports = router;