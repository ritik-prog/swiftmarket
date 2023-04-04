const Ticket = require('../models/Ticket');

// Get all tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate({
            path: 'messages.user_id',
            select: 'username'
        }).populate('order');
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get ticket by id
const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate({
            path: 'messages.user_id',
            select: 'username'
        }).populate('order');
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Assign ticket to an agent
const assignTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (ticket.agent_id) {
            return res.status(400).json({ error: 'Ticket is already assigned to an agent' });
        }
        ticket.agent_id = req.body.agent_id; // ----
        ticket.status = 'Pending';
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Reassign ticket to another agent
const reassignTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (!ticket.agent_id) {
            return res.status(400).json({ error: 'Ticket is not assigned to any agent' });
        }
        ticket.status = 'Open';
        ticket.agent_id = req.params.id;
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add message to a ticket
const addMessage = async (req, res) => {
    try {
        const ticket = await Ticket
            .findById(req.params.id)
            .populate('user_id', 'username')
            .populate('agent_id', 'username');
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        const { message } = req.body;
        const newMessage = {
            message,
            user_id: req.user.id
        };
        ticket.messages.push(newMessage);
        ticket.status = 'Pending';
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Change status of a ticket
const changeStatus = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        ticket.status = req.body.status;
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Change priority of a ticket
const changePriority = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        ticket.priority = req.body.priority;
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Handle ticket operations as an admin
const handleTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        const { message, status, priority } = req.body;
        if (message) {
            const newMessage = {
                message,
                user_id: req.user.id
            };
            ticket.messages.push(newMessage);
        }
        if (status) {
            ticket.status = status;
        }
        if (priority) {
            ticket.priority = priority;
        }
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    assignTicket,
    reassignTicket,
    addMessage,
    changeStatus,
    changePriority,
    handleTicket
};