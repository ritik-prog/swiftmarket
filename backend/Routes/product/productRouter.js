const express = require('express');
const { check } = require('express-validator');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');
const sellerController = require('../../controllers/seller/sellerController');
const Product = require('../../Models/product/productSchema');
const { getSellerProduct, createProductForSeller, getAllProductsOfSellerByUsername } = require('../../Controllers/product/productController');

const router = express.Router();

// GET all products of a seller by username
router.get('/:username/products',
    [authenticateMiddleware],
    getAllProductsOfSellerByUsername
);

// GET a specific product of a seller
router.get('/:username/product/:id', [authenticateMiddleware], getSellerProduct);

module.exports = router;