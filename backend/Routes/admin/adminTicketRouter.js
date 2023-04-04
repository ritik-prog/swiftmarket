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

// Assign ticket to an agent
router.put('/:id/assign', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.assignTicket);

// Reassign ticket to another agent
router.put('/:id/reassign', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.reassignTicket);

// Add message to a ticket
router.post('/:id/messages', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.addMessage);

// Change ticket status
router.put('/:id/status', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.changeStatus);

// Change ticket priority
router.put('/:id/priority', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.changePriority);

// Delete ticket
router.delete('/:id', [authenticateMiddleware, authorizeMiddleware(["admin", "superadmin", "root"]), checkVerificationMiddleware], ticketController.deleteTicket);

module.exports = router;
