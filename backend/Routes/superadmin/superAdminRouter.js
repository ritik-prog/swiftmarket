const express = require('express');

const router = express.Router();

const manageAdmins = require('./manageAdmins');

router.use('/admins', manageAdmins);

module.exports = router;