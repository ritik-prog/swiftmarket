const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../../Models/userSchema');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, username, address, paymentDetails, productListing } = req.body;

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
            paymentDetails,
            productListing,
            verificationStatus: false, // default false
            role: "user", // default user role
            transactionHistory: [], // empty array
            rating: 0 // default 0 rating
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const token = await user.generateAuthToken();

        res.json({ token });
    } catch (err) {
        console.error(err.message);
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

        if (!user) {
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
                paymentDetails: user.paymentDetails,
                productListing: user.productListing,
                verificationStatus: user.verificationStatus,
                role: user.role,
                transactionHistory: user.transactionHistory,
                rating: user.rating
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

        const user = await User.findById(decodedToken.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if user has permission to access this resource
        if (user._id.toString() !== req.user.id) {
            logger.warn(`Unauthorized access attempt by user ${req.user.id} for user ${user._id}`);
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
