const express = require("express");
const { check } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const adminController = require("../../controllers/admin/adminController");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");
const router = express.Router();

// Display all users
router.get("/users", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], adminController.getAllUsers);

// Get user by ID
router.get('/user/:id', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], adminController.getUserById);

// Create a new user
router.post(
    "/newuser",
    [
        authenticateMiddleware,
        authorizeMiddleware(["admin", "superadmin", "root"]),
        checkVerificationMiddleware,
        check("username").isLength({ min: 4, max: 25 }),
        check("email").isEmail().normalizeEmail(),
        check("password").isLength({ min: 6, max: 100 })
    ],
    adminController.createUser
);

// Update an existing user
router.put(
    "/updateuser/:id",
    [
        authenticateMiddleware,
        authorizeMiddleware(["admin", "superadmin", "root"]),
        checkVerificationMiddleware,
    ],
    adminController.updateUser
);

// Delete a user
router.delete(
    "/deleteuser/:id",
    [authenticateMiddleware,
        authorizeMiddleware(["admin", "superadmin", "root"]),
        checkVerificationMiddleware],
    adminController.deleteUser
);

// Ban a user
router.put('/users/:id/ban', [authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"]),
    checkVerificationMiddleware,], adminController.banUser);

module.exports = router;
