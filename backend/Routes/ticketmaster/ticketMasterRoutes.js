const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/ticketmaster/ticketMasterController');

const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');

const Ticket = require('../../models/ticket/ticketSchema');

// Get all tickets
router.get('/tickets', [authenticateMiddleware, authorizeMiddleware(['ticketmaster', 'admin', 'superadmin', 'root'])], ticketController.getAllTickets);

// POST join ticket as agent
router.post('/:id/join', [authenticateMiddleware, authorizeMiddleware(['ticketmaster', 'admin', 'superadmin', 'root'])], ticketController.ticketJoin);

// Get tickets assigned to current ticketmaster
router.get('/assigned', ticketAuthorize, async (req, res) => {
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
router.put('/:id/reassign', [authenticateMiddleware, authorizeMiddleware(['ticketmaster', 'admin', 'superadmin', 'root'])], ticketController.reassignTicket);

// Add message to ticket
router.post('/tickets/:id/messages', [authenticateMiddleware, authorizeMiddleware(['ticketmaster', 'admin', 'superadmin', 'root'])], ticketController.addMessage);

// Change ticket status
router.put('/tickets/:id/status', [authenticateMiddleware, authorizeMiddleware(['ticketmaster', 'admin', 'superadmin', 'root'])], ticketController.changeTicketStatus);

// Change ticket priority
router.put('/tickets/:id/priority', [authenticateMiddleware, authorizeMiddleware(['ticketmaster', 'admin', 'superadmin', 'root'])], ticketController.changeTicketPriority);

module.exports = router;
