const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const _ = require('lodash');

const Ip = require('../../Models/auth/ipSchema');
const User = require('../../Models/auth/userSchema');
const { sendVerificationCode } = require('../../utils/userVerification');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const ip = req.ip;
    const { name, email, password, username, address } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
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

        res.json({ token });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (_.isEmpty(user)) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const token = await user.generateAuthToken();

        res.json({
            token, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                address: user.address,
                verificationStatus: user.verificationStatus,
                role: user.role,
                transactionHistory: user.transactionHistory,
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.getUser = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.headers.authorization) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if user has permission to access this resource
        if (user._id.toString() !== decodedToken._id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user = await User.findById(req.user.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { username, name, email, address, paymentDetails } = req.body;

        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;
        user.address = address || user.address;
        user.paymentDetails = paymentDetails || user.paymentDetails;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user = await User.findById(req.user.id);

        // Check if current password matches
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate salt and hash for new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedPassword;

        // Generate and save new auth token
        const token = await user.generateAuthToken();

        res.json({ msg: 'Password updated successfully', token: token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user_id);
        user.tokens = [];
        await user.save();
        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

