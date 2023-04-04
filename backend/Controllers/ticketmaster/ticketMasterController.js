const Ticket = require('../models/Ticket');

// get all tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ agent_id: null })
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
};

// Join ticket as agent
const ticketJoin = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        // Check if ticket already has an agent assigned
        if (ticket.agent_id) {
            return res.status(400).json({ error: 'Ticket already has an agent assigned' });
        }

        // Assign current user as agent for ticket
        ticket.agent_id = req.user._id;
        await ticket.save();

        res.json({ message: 'You have joined the ticket as an agent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller to reassign a ticket to another agent
const reassignTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { priority } = req.body;

        // find the current agent's ticket
        const ticket = await Ticket.findOne({ _id: ticketId, agent_id: req.user._id });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // update the ticket with the new agent and status
        await Ticket.updateOne(
            { _id: ticketId },
            { $unset: { agent_id: '' }, $set: { status: 'Open', priority: priority } }
        );

        res.json({ message: 'Ticket reassigned successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add message to ticket
const addMessage = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if ticket master is the agent assigned to the ticket
        if (ticket.agent_id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'You are not authorized to add a message to this ticket' });
        }

        ticket.messages.push({
            message: req.body.message,
            user_id: req.user._id
        });
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Change ticket status
const changeTicketStatus = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if ticket master is the agent assigned to the ticket
        if (ticket.agent_id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'You are not authorized to change the status of this ticket' });
        }

        ticket.status = req.body.status;
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Change ticket priority
const changeTicketPriority = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check if ticket master is the agent assigned to the ticket
        if (ticket.agent_id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'You are not authorized to change the priority of this ticket' });
        }

        ticket.priority = req.body.priority;
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { addMessage, getAllTickets, changeTicketPriority, changeTicketStatus, ticketJoin, reassignTicket };
