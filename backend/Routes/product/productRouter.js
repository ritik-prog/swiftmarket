const express = require('express');
const { getSellerProduct, getAllProductsOfSellerByUsername, getProductById, getTopProductsInCategory, getRecommendations, getTopProducts, searchProductsByKeywords } = require('../../controllers/product/productController');

const router = express.Router();

// GET all products of a seller by username
router.get('/:username/products',
    getAllProductsOfSellerByUsername
);

// GET a specific product of a seller
router.get('/:username/product/:id', getSellerProduct);

// // GET a product by ID
router.get('/search/:id', getProductById);

// Predict the top 10 most popular products in a category
router.get('/category/trending', getTopProductsInCategory);

// Predict the top 10 most popular product
router.get('/trending', getTopProducts);

// Search products by keywords
router.get('/search', searchProductsByKeywords);

// Search products by history
router.get('/recommendations', getRecommendations)

module.exports = router;