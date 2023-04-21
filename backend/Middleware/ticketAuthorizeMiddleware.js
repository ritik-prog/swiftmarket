const Ticket = require('../models/ticket/ticketSchema');
const User = require('../models/user/userSchema');
const mongoose = require('mongoose');

const ticketAuthorize = async (req, res, next) => {
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
        }).populate({
            path: 'tickets',
            model: Ticket,
            select: '-__v',
            populate: {
                path: 'customer',
                select: 'email',
                model: User
            }
        });

        if (!user) {
            return res.status(415).json({ status: 'error', message: 'Unauthorized: Invalid token' });
        }

        // Set user in the request
        req.user = user;
        req.tickets = user.tickets;

        next();
    } catch (err) {

    }
};

module.exports = ticketAuthorize;
