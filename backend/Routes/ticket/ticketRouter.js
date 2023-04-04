const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket/ticketSchema');
const ticketAuthorize = require('../middleware/ticketAuthorize');
const ticketController = require('../../controllers/ticket/ticketController');

// GET tickets
router.get('/', ticketAuthorize, (req, res) => {
    res.json(req.tickets);
});

// GET ticket by id
router.get('/:id', ticketAuthorize, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate({
            path: 'messages.user_id',
            select: 'username',
        });
        res.json(ticket);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// CREATE one ticket
router.post('/', ticketAuthorize, ticketController.createTicket);

// ADD message to ticket
router.post('/:id/message', ticketController.addMessage);

module.exports = router;
