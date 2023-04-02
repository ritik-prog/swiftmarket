const express = require("express");

const adminProductRouter = require("./adminProductRouter");
const adminSellerRouter = require("./adminSellerRouter");
const adminUserRouter = require("./adminUserRouter");

const router = express.Router();

router.use('/product', adminProductRouter);
router.use('/seller', adminSellerRouter);
router.use('/user', adminUserRouter);

module.exports = router;
