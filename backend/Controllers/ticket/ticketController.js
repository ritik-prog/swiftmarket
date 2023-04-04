const Ticket = require('../models/ticket/ticketSchema');

const createTicket = async (req, res) => {
    try {
        const ticket = new Ticket({
            subject: req.body.subject,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
            customer_id: req.body.customer_id,
            agent_id: req.body.agent_id,
            messages: req.body.messages,
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
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
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