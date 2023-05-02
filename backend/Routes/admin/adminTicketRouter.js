const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const authorizeMiddleware = require("../../middleware/authorizeMiddleware");
const checkVerificationMiddleware = require("../../middleware/checkVerificationMiddleware");

// Get all tickets
router.get('/', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.getAllTickets);

// Get ticket by id
router.get('/:id', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.getTicketById);

// Add message to a ticket
router.post('/:id/messages', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.addMessage);

module.exports = router;
