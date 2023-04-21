const jwt = require('jsonwebtoken');
const User = require('../models/auth/userSchema');
const Seller = require('../models/seller/sellerSchema');

const authenticateMiddleware = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        // Check if not token
        if (!token) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized Access' });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is blacklisted
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token,
            'tokens.expiresAt': { $gte: Date.now() }
        });

        if (!user) {
            throw new Error();
        }

        // Set user in the request
        req.user = user;
        // Check if user is a seller
        if (user.role === 'seller') {
            const seller = await Seller.findById(user.seller._id);

            if (!seller) {
                throw new Error();
            }

            // Set seller in the request
            req.seller = seller;
        }

        next();
    } catch (err) {
        return res.status(415).json({ status: 'error', message: 'Unauthorized' });
    }
};

module.exports = authenticateMiddleware;
