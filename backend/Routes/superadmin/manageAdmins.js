const express = require('express');

const { param } = require('express-validator');

const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');

const superAdminController = require('../../controllers/superadmin/superAdminController');

const router = express.Router();

// Get all admins
router.get('/getAdmins', [authenticateMiddleware, authorizeMiddleware(['superadmin', 'root'])], superAdminController.getAdmins);

// Get one admin by ID
router.get('/admins/:id', [authenticateMiddleware, authorizeMiddleware(['superadmin', 'root'])], superAdminController.getAdminById);

// Create an admin
router.post('/createAdmin', [authenticateMiddleware, authorizeMiddleware(['superadmin']), check('name').notEmpty().isString().trim(),
    check('email').notEmpty().isEmail().normalizeEmail(),
    check('password').notEmpty().isString().trim(),], superAdminController.createAdmin);

// Update an admin
router.put('/updateAdmin/:id', [authenticateMiddleware, authorizeMiddleware(['superadmin']), check('name').notEmpty().isString().trim(),
    check('email').notEmpty().isEmail().normalizeEmail(),
    check('password').notEmpty().isString().trim(),], superAdminController.updateAdmin);

// Delete an admin
router.delete('/deleteAdmin/:id', [
    param('id').isMongoId().withMessage('Invalid admin ID.')
], superAdminController.deleteAdmin);

module.exports = router;