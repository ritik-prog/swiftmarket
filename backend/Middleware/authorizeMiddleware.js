const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../Errors/Unauthorized');
const User = require('../Models/auth/userSchema');

const authorizeMiddleware = (role) => async (req, res, next) => {
    // Check if there is an Authorization header in the request
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Unauthorized('Authorization header missing or invalid');
    }

    // Extract the token from the header
    const token = authHeader.slice(7);

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new Unauthorized('Invalid or expired token');
        }
        if (user.role !== role) {
            throw new Unauthorized('User not authorized to access this resource');
        }
        req.user = user;
        next();
    } catch (err) {
        throw new Unauthorized('Invalid or expired token');
    }
};

module.exports = authorizeMiddleware;
