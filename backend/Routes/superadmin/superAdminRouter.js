const express = require('express');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');
const authorizeChangeMiddleware = require('../../middleware/authorizeChangeMiddleware');

const Admin = require('../../models/auth/userSchema');
const { param } = require('express-validator');

const router = express.Router();

// Get all admins
router.get('/getAdmins', [authenticateMiddleware, authorizeMiddleware(['superadmin', 'root'])], async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'superadmin' });
        return res.status(200).json(admins);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Create an admin
router.post('/createAdmin', [authenticateMiddleware, authorizeMiddleware(['superadmin'])], async (req, res) => {
    try {
        // Check if the current user is authorized to perform this action
        authorizeChangeMiddleware(req.user.role);

        // Get the admin data from the request body
        const { name, email, password, role } = req.body;

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin document
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Save the new admin document to the database
        await newAdmin.save();

        // Return the new admin document
        res.status(201).json(newAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update an admin
router.put('/updateAdmin/:id', authenticateMiddleware, authorizeMiddleware(['superadmin']), async (req, res) => {
    try {
        // Check if the current user is authorized to perform this action
        authorizeChangeMiddleware(req.user.role);

        // Get the admin ID from the request parameters
        const adminId = req.params.id;

        // Get the admin data from the request body
        const { name, email, password, role } = req.body;

        // Check if the admin exists
        const admin = await Admin.findOne({ _id: ObjectId(adminId) });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Update the admin document
        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.role = role || admin.role;

        // Hash the new password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            admin.password = hashedPassword;
        }

        // Save the updated admin document to the database
        await admin.save();

        // Return the updated admin document
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete an admin
router.delete('/deleteAdmin/:id', [
    param('id').isMongoId().withMessage('Invalid admin ID.')
], async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found.' });
        }
        await admin.remove();
        return res.status(200).json({ message: 'Admin deleted successfully.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;