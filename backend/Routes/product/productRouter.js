const express = require('express');
const { getSellerProduct, getAllProductsOfSellerByUsername, getProductById, getTopProductsInCategory, searchProductsByFilters, searchProductsKeywords } = require('../../controllers/product/productController');

const router = express.Router();

// GET all products of a seller by username
router.get('/:username/products',
    getAllProductsOfSellerByUsername
);

// GET a specific product of a seller
router.get('/:username/product/:id', getSellerProduct);

// GET a product by ID
router.get('/:id', getProductById);

// Predict the top 10 most popular products in a category
router.post('/category/popularity', getTopProductsInCategory);

router.put('/search', searchProductsByFilters);

module.exports = router;