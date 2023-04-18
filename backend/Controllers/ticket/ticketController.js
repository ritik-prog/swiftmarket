const { validationResult } = require('express-validator');
const Ticket = require('../models/ticket/ticketSchema');

const createTicket = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const ticket = new Ticket({
            subject: req.body.subject,
            description: req.body.description,
            order: req.body.order,
            customer_id: req.user._id,
        });

        const newTicket = await ticket.save();

        // Add new ticket to user's tickets
        req.user.tickets.push(newTicket._id);
        await req.user.save();

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addMessage = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    try {
        const ticket = await Ticket.findById({ _id: id, customer_id: req.user._id });
        if (!ticket) {
            return res.status(422).json({ message: 'Ticket not found' });
        }

        ticket.messages.push({ message, user_id: req.user._id });
        await ticket.save();

        res.status(201).json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createTicket, addMessage };