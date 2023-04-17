const express = require('express');
const { getSellerProduct, getAllProductsOfSellerByUsername, getProductById, getTopProductsInCategory, getRecommendations, getTopProducts, searchProductsByKeywords, getTopProductsByDifferentFilters, getTopProductsByTopCategorySearched, searchProductsByCategory } = require('../../controllers/product/productController');

const router = express.Router();

// GET all products and profile of a seller by username
router.get('/seller/:username',
    getAllProductsOfSellerByUsername
);

// GET a specific product of a seller
router.get('/:username/product/:id', getSellerProduct);

// // GET a product by ID
router.get('/search/:id', getProductById);

// Predict the top 5 most popular products in a category
router.get('/category/trending', getTopProductsInCategory);

// Predict the top 5 most popular product
router.get('/trending', getTopProducts);

// Top products by popularityscore, views, likes, ratings
router.get('/getTopProductsByDifferentFilters', getTopProductsByDifferentFilters);

// Top products by top searched category
router.get('/getTopProductsByTopCategorySearched', getTopProductsByTopCategorySearched);

// Search products by keywords
router.get('/search', searchProductsByKeywords);

// Search products by keywords
router.get('/search/category/:category', searchProductsByCategory);


// Search products by history
router.get('/recommendations', getRecommendations)

module.exports = router;