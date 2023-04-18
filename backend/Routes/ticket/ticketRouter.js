const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket/ticketSchema');
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const ticketController = require('../../controllers/ticket/ticketController');

// GET tickets
router.get('/', authorizeMiddleware, async (req, res) => {
    try {
        const tickets = await Ticket.find({ customer_id: req.user._id })
            .populate({
                path: 'messages.user_id',
                select: 'username',
            })
            .exec();

        res.status(200).json({ tickets, status: 200 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET ticket by id
router.get('/:id', authorizeMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById({ _id: id, customer_id: req.user._id })
            .populate({
                path: 'messages.user_id',
                select: 'username'
            });
        res.json(ticket);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// CREATE one ticket
router.post('/', [authorizeMiddleware, check('subject').not().isEmpty().withMessage('Subject is required'),
    check('description')
        .not()
        .isEmpty()
        .withMessage('Description is required'),
    check('order').not().isEmpty().withMessage('Order is required')], ticketController.createTicket);

// ADD message to ticket
router.post('/:id/message', [authorizeMiddleware, check('message')
    .isLength({ min: 6 })
    .withMessage('Message must be at least 6 characters long')], ticketController.addMessage);

module.exports = router;
