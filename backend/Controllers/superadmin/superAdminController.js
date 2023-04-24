const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const authorizeChangeMiddleware = require('../../middleware/authorizeChangeMiddleware');
const Admin = require('../../models/auth/userSchema');
const handleError = require('../../utils/errorHandler');
const { validationResult } = require('express-validator');

// get all admins
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'superadmin' });
        return res.status(200).json({ admins, status: 'success' });
    } catch (err) {
        return handleError(res, err);
    }
}

// get one admin by ID
const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Admin not found',
            });
        }
        res.status(200).json(admin);
    } catch (err) {
        return handleError(res, err);
    }
};

// create an admin
const createAdmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        // Check if the current user is authorized to perform this action
        authorizeChangeMiddleware(req.user.role);

        // Get the admin data from the request body
        const { name, email, password } = req.body;

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'Admin already exists',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin document
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role: "admin",
        });

        // Save the new admin document to the database
        await newAdmin.save();

        // Return the new admin document
        res.status(200).json({ newAdmin, status: 'success', });
    } catch (error) {
        return handleError(res, err);
    }
}

// update an admin
const updateAdmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        // Check if the current user is authorized to perform this action
        authorizeChangeMiddleware(req.user.role);

        // Get the admin ID from the request parameters
        const adminId = req.params.id;

        // Get the admin data from the request body
        const { name, email, password, role } = req.body;

        // Check if the admin exists
        const admin = await Admin.findOne({ _id: ObjectId(adminId) });
        if (!admin) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Admin not found',
            });
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
        return handleError(res, err);
    }
}

// delete an admin
const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'Admin not found',
            });
        }
        await admin.remove();
        return res.status(200).json({ status: 'success', message: 'Admin deleted successfully.' });
    } catch (err) {
        return handleError(res, err);
    }
}

module.exports = { getAdmins, createAdmin, updateAdmin, deleteAdmin, getAdminById };