const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/ticketmaster/ticketMasterController');

const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');

const Ticket = require('../../models/ticket/ticketSchema');
const { check } = require('express-validator');

// login as tikcet master
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    ticketController.ticketMasterLogin
);

// Get all tickets
router.get('/tickets', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.getAllTickets);

// POST join ticket as agent
router.post('ticket/:id/join', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.ticketJoin);

// Get tickets assigned to current ticketmaster
router.get('/assigned', [authorizeMiddleware(['ticketmaster'])], async (req, res) => {
    try {
        const tickets = await Ticket.find({ agent_id: req.user._id })
            .populate({
                path: 'messages.user_id',
                select: 'username'
            })
            .populate('order');
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to reassign a ticket to another agent
router.put('ticket/:id/reassign', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.reassignTicket);

// Add message to ticket
router.post('/ticket/:id/messages', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.addMessage);

// Change ticket status
router.put('/ticket/:id/status', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.changeTicketStatus);

// Change ticket priority
router.put('/ticket/:id/priority', [authenticateMiddleware, authorizeMiddleware(['ticketmaster'])], ticketController.changeTicketPriority);

module.exports = router;
