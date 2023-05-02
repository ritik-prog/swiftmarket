const { validationResult } = require('express-validator');

const User = require('../../models/auth/userSchema');
const authorizeChangeMiddleware = require('../../middleware/authorizeChangeMiddleware');
const handleError = require('../../utils/errorHandler');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: 'success', message: 'Users retrieved successfully', data: users });
    } catch (err) {
        return handleError(res, err);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ status: 'success', user: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'User already exists',
            });
        }

        authorizeChangeMiddleware(user.role);

        // Create new user
        user = new User({ username, email, password });

        // Hash password and save user
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Generate JWT token and send response
        const token = await user.generateAuthToken();
        const data = {
            newUser: {
                name: user.name,
                email: user.email,
                role: user.role,
                password: password
            },
            adminUsername: req.user.username,
            subject: 'New user Account - SwiftMarket'
        };

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');

        res.status(200).json({ status: 'success', data: { user, token } });

    } catch (err) {
        return handleError(res, err);
    }
};

// update user
const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }
        const { id } = req.params;

        // check if user exists
        const user = await User.findById(id);
        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        authorizeChangeMiddleware(user.role);

        // update user information
        const { username, name, email, number, address } = req.body;

        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;
        user.number = number || user.number;
        user.address = address || user.address;
        await user.save();

        const data = {
            userUpdated: {
                code: user.name,
                email: user.email,
                role: user.role
            },
            violation: {
                name: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.username,
            },
            subject: 'User details updated - SwiftMarket'
        };

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');

        res.status(200).json({ status: 'success', message: 'User updated successfully', data: user });
    } catch (err) {
        return handleError(res, err);
    }
};

// delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        authorizeChangeMiddleware(user.role);

        await user.delete();
        const data = {
            userDeleted: {
                code: user.name,
                email: user.email,
                role: user.role
            },
            violation: {
                code: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.fullname,
            },
            subject: 'User account deleted - SwiftMarket'
        };

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');

        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (err) {
        return handleError(res, err);
    }
};

// ban user
const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }
        authorizeChangeMiddleware(user.role);
        user.banStatus.isBanned = true;
        user.banStatus.banExpiresAt = req.body.expiresAt;
        await user.save();

        const data = {
            userBanned: {
                code: user.name,
                email: user.email,
            },
            violation: {
                code: req.body.violationName,
                reason: req.body.violationReason,
                adminUsername: req.user.fullname,
            },
            subject: 'Account banned - SwiftMarket'
        };

        await sendEmail(user.email, data, './violationOfTerms/userTerms.hbs');


        res.status(200).json({ status: 'success', message: 'User has been banned successfully' });
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = { getUserById, getAllUsers, createUser, updateUser, deleteUser, banUser };