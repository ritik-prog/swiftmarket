const { validationResult } = require('express-validator');

const User = require('../../models/auth/userSchema');
const authorizeChangeMiddleware = require('../../middleware/authorizeChangeMiddleware');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: 'success', message: 'Users retrieved successfully', data: users });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
        }
        const { username, name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        authorizeChangeMiddleware(user.role);

        // Create new user
        user = new User({ username, name, email, password });

        // Hash password and save user
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Generate JWT token and send response
        const token = await user.generateAuthToken();
        res.status(201).json({ status: 'success', data: { user, token } });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// update user
const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
        }
        const { id } = req.params;
        const updates = req.body;

        // check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        authorizeChangeMiddleware(user.role);

        // update user information
        Object.keys(updates).forEach((key) => (user[key] = updates[key]));
        await user.save();

        res.status(200).json({ status: 'success', message: 'User updated successfully', data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        authorizeChangeMiddleware(user.role);

        await user.delete();
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// ban user
const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        authorizeChangeMiddleware(user.role);
        user.banStatus.isBanned = true;
        user.banStatus.banExpiresAt = req.body.expiresAt;
        await user.save();

        res.status(200).json({ status: 'success', message: 'User has been banned successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

module.exports = { getAllUsers , createUser , updateUser , deleteUser , banUser};