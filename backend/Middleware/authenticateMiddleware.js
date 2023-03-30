const jwt = require('jsonwebtoken');
const config = require('config');

const authenticateMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if not token
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Set user in the request
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateMiddleware;
