const express = require("express");
const { check } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const adminController = require("../../controllers/admin/adminController");

const router = express.Router();

// Get applied sellers
router.get(
    "/applied-sellers",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"])],
    adminController.getAllApplySellers
);

// Accept seller
router.post(
    "/approve-seller/:id",
    [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"])],
    adminController.acceptSeller
);

// Get all sellers
router.get("/sellers", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"])], adminController.getAllSellers);

// Update seller
router.put("/updateseller/:id", [
    authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"])
], adminController.updateSeller);

// Delete seller
router.delete("/deleteseller/:id", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"])], adminController.deleteSeller);

module.exports = router;
