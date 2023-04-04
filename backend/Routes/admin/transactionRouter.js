const express = require('express');
const router = express.Router();
const Transaction = require('../../models/transaction/transactionSchema');
const authenticateMiddleware = require('../../middleware/authenticateMiddleware');
const authorizeMiddleware = require('../../middleware/authorizeMiddleware');

// Get all transactions
router.get('/', [authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"])], async (req, res) => {
        try {
            const transactions = await Transaction.find({});
            res.send(transactions);
        } catch (error) {
            res.status(500).send(error);
        }
    });

// Get a single transaction by ID
router.get('/:id', [authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"])], async (req, res) => {
        try {
            const transaction = await Transaction.findById(req.params.id);
            if (!transaction) {
                return res.status(404).send();
            }
            res.send(transaction);
        } catch (error) {
            res.status(500).send(error);
        }
    });

// Update a transaction by ID
router.patch('/:id', [authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"])], async (req, res) => {
        res.status(405).send({ error: 'Method Not Allowed' });
    });

// Delete a transaction by ID
router.delete('/:id', [authenticateMiddleware,
    authorizeMiddleware(["admin", "superadmin", "root"])], async (req, res) => {
        res.status(405).send({ error: 'Method Not Allowed' });
    });

module.exports = router;
