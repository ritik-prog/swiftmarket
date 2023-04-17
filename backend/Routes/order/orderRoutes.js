const express = require("express");
const router = express.Router();
const Order = require("../../models/order/orderSchema");
const User = require('../../models/auth/userSchema')
const Transaction = require("../../models/transaction/transactionSchema");
const Product = require("../../models/product/productSchema");
const { v4: uuidv4 } = require("uuid");

const authenticateMiddleware = require("../../middleware/authenticateMiddleware");
const { check, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

// Create a place order
router.post(
    "/placeorder",
    authenticateMiddleware,
    [
        check("shippingAddress").not().isEmpty(),
        check("products").isArray().not().isEmpty(),
        check("transactionId").isEmpty(),
    ],
    async (req, res) => {
        // Data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { shippingAddress, products, transactionId } = req.body;

        let session;
        try {
            // session = await mongoose.startSession();
            // session.startTransaction();

            // find transaction is Completed or not
            const foundTransaction = await Transaction.findOne({
                transactionId,
                status: "Completed",
            });

            if (foundTransaction && foundTransaction.cartId === null) {
                // Find product details
                const productDetails = [];
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];
                    const foundProduct = await Product.findById(product.id);
                    if (!foundProduct) {
                        throw new Error(`Product with ID ${product.id} not found`);
                    }
                    productDetails.push({
                        product: foundProduct,
                        quantity: product.quantity,
                    });
                }

                const cartId = `cart_${Date.now()}_${uuidv4()}`;
                console.log(cartId)

                const sellers = new Set();
                for (let product of productDetails) {
                    const seller = product.product.seller;
                    const found = Array.from(sellers).some((s) => s._id.equals(seller._id));
                    if (!found) {
                        sellers.add(seller);
                    }
                }
                for (let seller of sellers) {
                    const sellerId = new ObjectId(seller); // ensure that seller is an ObjectId
                    const subOrderProducts = [];
                    for (let product of productDetails) {
                        if (product.product.seller.equals(sellerId)) {
                            subOrderProducts.push({ product: product.product._id, quantity: product.quantity });
                        }
                    }
                    await Order.create(
                        {
                            seller: sellerId,
                            shippingAddress,
                            customer: req.user._id,
                            transactionId: foundTransaction._id,
                            cartId,
                            products: subOrderProducts,
                        },
                    );
                }

                foundTransaction.cartId = cartId;
                foundTransaction.save();


                // await session.commitTransaction();
                // session.endSession();

                res.status(200).json({ message: "Order placed successfully", status: 200 });
                const user = await User.findOne({
                    _id: req.user._id
                });
                user.address = shippingAddress;
                await user.save();
            } else {
                res.status(421).json({ message: "Can't place order as of now...", status: 421 });
                // await session.abortTransaction();
                // session.endSession();
                return;
            }
        } catch (error) {
            console.error(error);
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }
            res.status(500).json({ message: "Server Error" });
        }
    }
);

// Create a transaction
router.post("/transaction", async (req, res) => {
    const { type, amount, paymentMethod, paymentDetails } = req.body;

    try {
        const newTransaction = new Transaction({
            type,
            amount,
            status: "Pending",
            paymentMethod,
            paymentDetails,
        });

        await newTransaction.save();

        // Delay the status update by 5 minutes
        setTimeout(async () => {
            const transaction = await Transaction.findById(newTransaction._id);
            if (transaction.status === "Pending") {
                transaction.status = "Failed";
                await transaction.save();
                console.log(`Transaction ${transaction._id} has failed`);
            }
        }, 300000); // 5 minutes in milliseconds

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update a transaction
router.put("/transaction/:id", async (req, res) => {
    const { type, amount, status, paymentMethod, paymentDetails, order } =
        req.body;

    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        transaction.type = type || transaction.type;
        transaction.amount = amount || transaction.amount;
        transaction.status = status || transaction.status;
        transaction.paymentMethod = paymentMethod || transaction.paymentMethod;
        transaction.paymentDetails = paymentDetails || transaction.paymentDetails;
        transaction.order = order || transaction.order;

        const updatedTransaction = await transaction.save();

        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all orders for a customer
router.get("/", authenticateMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate(
                "subOrders.seller",
                "businessName businessNumber businessEmail sellerID"
            )
            .populate(
                "subOrders.products",
                "productName productPrice productQuantity seller"
            );
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
