const express = require("express");
const { check, param } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const adminController = require("../../controllers/admin/adminController");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");

const router = express.Router();

// GET /products
router.get(
    "/",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.getAllProducts
);

// GET /products/seller/:username
router.get(
    "/seller/:username",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.getAllProductsOfSellerByUsername
);

// GET /products/:id
router.get(
    "/:id",
    [
        [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
        param("id").isMongoId(),
    ],
    adminController.getProductById
);

// PUT /products/:id
router.put(
    "/:id",
    [
        authenticateMiddleware,
        authorizeMiddleware(["admin", "superadmin", "root"]),
        checkVerificationMiddleware,
        check('productName').trim().notEmpty(),
        check('productDescription').trim().notEmpty(),
        check('price').isFloat({ min: 0 }),
        check('quantity').isInt({ min: 0 }),
        check('category').trim().notEmpty(),
        check('imagesUrl').isArray(),
        check('thumbnailUrl').notEmpty(),
        check('featured').isBoolean(),
    ],
    adminController.updateProduct
);

// DELETE /products/:id
router.delete(
    "/:id",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware],
    adminController.deleteProduct
);

module.exports = router;
