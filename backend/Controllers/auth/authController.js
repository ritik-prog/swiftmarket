const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const _ = require('lodash');

const Ip = require('../../models/auth/ipSchema');
const User = require('../../models/auth/userSchema');
const { sendVerificationCode } = require('./verificationController');
const handleError = require('../../utils/errorHandler');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        handleError(res, {
            name: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }

    const ip = req.ip;
    const { name, email, password, username, address } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            handleError(res, {
                name: 'already_exists',
                status: 'error',
                message: 'User already exists',
            });
        }

        user = new User({
            name,
            email,
            password,
            username,
            address,
            verificationStatus: false, // default false
            role: "user", // default user role
            transactionHistory: [], // empty array
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const token = await user.generateAuthToken();

        await user.save().then(async () => {
            await sendVerificationCode(user.email);
        });

        const existingIp = await Ip.findOne({ address: ip });
        if (existingIp) {
            // If the IP is already in the database, increment the signup count
            existingIp.signupCount += 1;
            existingIp.lastSignupAt = Date.now();
            await existingIp.save();
        } else {
            // If the IP is not in the database, create a new IP document with the initial signup count
            const newIp = new Ip({
                address: ip,
                signupCount: 1,
                lastSignupAt: Date.now()
            });
            await newIp.save();
        }

        res.status(202).json({ token });
    } catch (err) {
        handleError(res, err);
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        handleError(res, {
            name: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (_.isEmpty(user)) {
            handleError(res, {
                message: 'Invalid Credentials',
                code: 401
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            handleError(res, {
                message: 'Invalid Credentials',
                code: 401
            });
        }

        const token = await user.generateAuthToken();

        res.status(202).json({
            token, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                address: user.address,
                verificationStatus: user.verificationStatus,
                role: user.role
            }
        });
    } catch (err) {
        handleError(res, err);
    }
}

exports.getUser = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.headers.authorization) {
            handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id).select('-password');

        if (!user) {
            handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        // Check if user has permission to access this resource
        if (user._id.toString() !== decodedToken._id) {
            handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        res.status(202).json(user);
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            handleError(res, {
                name: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id).select('-password -__v');
        if (!user) {
            handleError(res, {
                name: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        const { username, name, email, address, paymentDetails } = req.body;

        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;
        user.address = address || user.address;
        user.paymentDetails = paymentDetails || user.paymentDetails;

        await user.save();
        res.status(202).json(user);
    } catch (err) {
        handleError(res, err);
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            handleError(res, {
                name: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id);

        // Check if current password matches
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            handleError(res, {
                message: 'Invalid Credentials',
                code: 401
            });
        }

        // Generate salt and hash for new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedPassword;

        // Generate and save new auth token
        const token = await user.generateAuthToken();

        res.status(202).json({ message: 'Password updated successfully', token: token });
    } catch (err) {
        handleError(res, err);
    }
};

exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user_id);
        user.tokens = [];
        await user.save();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        handleError(res, err);
    }
};
