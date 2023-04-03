const express = require("express");
const { check } = require("express-validator");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const adminController = require("../../controllers/admin/adminController");

const router = express.Router();

// Display all users
router.get("/users", [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"])], adminController.getAllUsers);

// Create a new user
router.post(
    "/newuser",
    [
        authorizeMiddleware(["admin", "superadmin", "root"]),
        check("username").isLength({ min: 4, max: 20 }),
        check("name").isLength({ min: 2, max: 50 }),
        check("email").isEmail().normalizeEmail(),
        check("password").isLength({ min: 6, max: 100 })
    ],
    adminController.createUser
);

// Update an existing user
router.put(
    "/updateuser/:id",
    [
        authorizeMiddleware(["admin", "superadmin", "root"]),
        check("username")
            .notEmpty()
            .withMessage("Username is required")
            .isLength({ min: 4, max: 20 })
            .withMessage("Username must be between 4 and 20 characters long"),
        check("name")
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ min: 2, max: 50 })
            .withMessage("Name must be between 2 and 50 characters long"),
        check("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Please enter a valid email address"),
        check("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6, max: 100 })
            .withMessage("Password must be between 6 and 100 characters long"),
        check("address")
            .isLength({ max: 100 })
            .withMessage("Address must be at most 100 characters long"),
    ],
    adminController.updateUser
);

// Delete a user
router.delete(
    "/deleteuser/:id",
    authorizeMiddleware(["admin", "superadmin", "root"]),
    adminController.deleteUser
);

// Ban a user
router.put('/users/:id/ban', [authorizeMiddleware('admin')], adminController.banUser);

module.exports = router;