const express = require("express");
const { check } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const adminController = require("../../controllers/admin/adminController");

const router = express.Router();

// GET /products
router.get(
    "/",
    [authenticateMiddleware, authorizeMiddleware("admin")],
    adminController.getAllProducts
);

// GET /products/seller/:username
router.get(
    "/seller/:username",
    [authenticateMiddleware, authorizeMiddleware("admin")],
    adminController.getAllProductsOfSellerByUsername
);

// GET /products/:id
router.get(
    "/:id",
    [
        [authenticateMiddleware, authorizeMiddleware("admin")],
        param("id").isMongoId(),
    ],
    adminController.getProductById
);

// PUT /products/:id
router.put(
    "/:id",
    [
        authenticateMiddleware,
        authorizeMiddleware("admin"),
        body("productName").trim().notEmpty(),
        body("productDescription").trim().notEmpty(),
        body("price").isFloat({ min: 0 }),
        body("quantity").isInt({ min: 0 }),
        body("category").trim().notEmpty(),
        body("imagesUrl").isArray(),
        body("thumbnailUrl").notEmpty(),
        body("featured").isBoolean(),
    ],
    adminController.updateProduct
);

// DELETE /products/:id
router.delete(
    "/:id",
    [authenticateMiddleware, authorizeMiddleware("admin")],
    adminController.deleteProduct
);

module.exports = router;
