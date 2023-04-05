const express = require('express');
const router = express.Router();
const Order = require('../../models/order/orderSchema');
const SubOrder = require('../../models/order/subOrderSchema');

const authenticate = require('../../middleware/authenticateMiddleware');

// Create a place order
router.post(
    '/placeorder',
    authenticate,
    [
        check('orderId').not().isEmpty(),
        check('shippingAddress').not().isEmpty(),
        check('paymentMethod').not().isEmpty(),
        check('customer').not().isEmpty(),
        check('products').isArray().not().isEmpty(),
    ],
    async (req, res) => {
        // Data validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderId, shippingAddress, paymentMethod, customer, products } = req.body;

        let session;
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            // Create a new subOrder for each seller
            const subOrders = [];
            const sellers = new Set(products.map(product => product.seller));
            for (let seller of sellers) {
                const subOrderProducts = products.filter(product => product.seller === seller).map(product => product.id);
                const newSubOrder = await SubOrder.create([{ seller, products: subOrderProducts }], { session });
                subOrders.push(newSubOrder[0]._id);
            }

            // Create the main order with the subOrders
            const newOrder = await Order.create([{ orderId, shippingAddress, paymentMethod, customer, subOrders }], { session });

            // Create a new transaction
            const newTransaction = new Transaction({
                type: 'Order',
                amount: 0,
                status: 'Pending',
                paymentMethod,
                paymentDetails: JSON.stringify({ orderId }),
            });
            await newTransaction.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json(newOrder[0]);
        } catch (error) {
            console.error(error);
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({ message: 'Server Error' });
        }
    }
);

// Get all orders for a customer
router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('subOrders.seller', 'businessName businessNumber businessEmail sellerID')
            .populate('subOrders.products', 'productName productPrice productQuantity seller');
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update a specific order by ID
router.patch('/updateorder/:id', authenticate, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }
        if (req.body.orderStatus) {
            order.orderStatus = req.body.orderStatus;
        }
        if (req.body.estimatedDeliveryDate) {
            order.estimatedDeliveryDate = req.body.estimatedDeliveryDate;
        }
        if (req.body.subOrders) {
            order.subOrders = req.body.subOrders;
        }
        if (req.body.notes) {
            order.notes = req.body.notes;
        }
        const updatedOrder = await order.save();
        res.send(updatedOrder);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Delete a specific order by ID
router.delete('/deleteorder/:id', authenticate, async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, customer: req.user._id });
        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }
        res.send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
