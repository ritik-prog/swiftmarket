const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

const Ip = require('../../models/auth/ipSchema');
const User = require('../../models/auth/userSchema');
const { sendVerificationCode } = require('./verificationController');
const handleError = require('../../utils/errorHandler');
const sendEmail = require('../../utils/sendEmail');
const { default: mongoose } = require('mongoose');
const Seller = require('../../models/seller/sellerSchema');
const generateCode = require('../../utils/generateCode');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }

    const ip = req.ip;
    const { email, password, username } = req.body;

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return handleError(res, {
                code: 'already_exists',
                status: 'error',
                message: 'User already exists',
            });
        }

        user = new User({
            email,
            password,
            username
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const token = await user.generateAuthToken();

        await user.save().then(async () => {
            await sendVerificationCode(res, user.email);
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

        res.status(200).json({ status: 'success' });
    } catch (err) {
        return handleError(res, err);
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }

    const { email, password } = req.body;

    try {
        User.findByCredentials(email, password).then(async ({ token, user }) => {

            if (!user) {
                return handleError(res, {
                    message: 'Invalid Credentials',
                    status: 401,
                    code: 'authentication_failed'
                });
            }

            if (user.role === "seller") {
                const seller = await Seller.findById(user.seller);
                const verificationCode = generateCode();
                const codeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

                seller.loginCode = verificationCode;
                seller.loginCodeExpiresAt = codeExpiry;
                await seller.save();

                const data = {
                    subject: 'Seller Login - SwiftMarket',
                    username: seller.businessName,
                    verificationCode: seller.loginCode,
                    verificationLink: `http://localhost:3001/login/${seller.businessEmail}`
                };

                await sendEmail(seller.businessEmail, data, './seller/loginVerification.hbs');

                return res.status(200).json({ role: "seller", message: "Please check your email address for login instructions." });
            } else {
                // Set token in cookies
                res.cookie('token', token, {
                    httpOnly: true, // cookie cannot be accessed from client-side scripts
                    secure: process.env.NODE_ENV === 'production', // cookie should only be sent over HTTPS in production
                    sameSite: 'strict', // cookie should only be sent for same-site requests
                    maxAge: 5 * 60 * 60 * 1000 // 5hr
                });

                res.status(200).json({
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        address: user.address,
                        verificationStatus: user.verificationStatus,
                        role: user.role
                    },
                    status: 'success'
                });
            }
        }).catch((err) => {
            throw err;
        });
    } catch (err) {
        return handleError(res, {
            message: 'Invalid Credentials',
            status: 401,
            code: 'authentication_failed'
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        // Check if user is authenticated
        if (!token) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id).select('-password');

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found',
            });
        }

        // Check if user has permission to access this resource
        if (user._id.toString() !== decodedToken._id) {
            return handleError(res, {
                code: 'unauthorized_access',
                status: 'error',
                message: 'Unauthorized Access',
            });
        }

        res.status(200).json({ user, status: 'success', });
    } catch (err) {
        return handleError(res, err);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id).select('-password -__v');
        if (!user) {
            return handleError(res, {
                code: 'not_found',
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

        const data = {
            userUpdated: {
                code: user.name,
                email: user.email,
                role: user.role
            },
            subject: 'Account Updated - SwiftMarket'
        };

        await sendEmail(user.email, data, './userActions/userAccountChange.hbs');

        res.status(200).json({ user, status: 'success', });
    } catch (err) {
        return handleError(res, err);
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return handleError(res, {
                code: 'CustomValidationError',
                status: 'error',
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id);

        // Check if current password matches
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            return handleError(res, {
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

        const data = {
            passwordUpdated: {
                code: user.name,
                email: user.email,
                role: user.role
            },
            subject: 'Password Updated - SwiftMarket'
        };

        await sendEmail(user.email, data, './userAction/userAccountChange.hbs');


        res.status(200).json({ message: 'Password updated successfully', token: token, status: 'success', });
    } catch (err) {
        return handleError(res, err);
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        const user = await User.findById(req.user._id);
        user.tokens = [];
        await user.save();
        res.status(200).json({ message: 'Logged out successfully', status: 'success' });
    } catch (err) {
        return handleError(res, err);
    }
};

exports.deleteAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return handleError(res, {
            code: 'CustomValidationError',
            status: 'error',
            errors: errors.array()
        });
    }
    try {
        const token = req.cookies.token;
        const { password } = req.body;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decodedToken._id,
            'tokens.token': token,
            'tokens.expiresAt': { $gte: Date.now() }
        });

        if (!user) {
            return handleError(res, {
                code: 'not_found',
                status: 'error',
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleError(res, {
                message: 'Invalid Credentials',
                code: 401
            });
        }

        await user.remove();
        const data = {
            userDeleted: {
                code: user.name,
                email: user.email,
                role: user.role,
                deletedAt: new Date()
            },
            subject: 'Account Deleted - SwiftMarket'
        };

        await sendEmail(user.email, data, './userActions/userAccountChange.hbs');

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });

    } catch (err) {
        return handleError(res, err);
    }
};
