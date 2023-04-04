const express = require('express');
const router = express.Router();
const Order = require('../../models/order/orderSchema');
const SubOrder = require('../../models/order/subOrderSchema');

// Create a new order
router.post('/neworder', async (req, res) => {
    try {
        const { orderId, shippingAddress, paymentMethod, customer, products } = req.body;

        // Create a new subOrder for each seller
        const subOrders = [];
        const sellers = new Set(products.map(product => product.seller));
        for (let seller of sellers) {
            const subOrderProducts = products.filter(product => product.seller === seller).map(product => product.id);
            const newSubOrder = await SubOrder.create({
                seller,
                products: subOrderProducts,
            });
            subOrders.push(newSubOrder._id);
        }

        // const subOrders = await Promise.all([...sellers].map(async (seller) => {
        //     const subOrderProducts = products.filter(product => product.seller === seller).map(product => product.id);
        //     const newSubOrder = await SubOrder.create({
        //         seller,
        //         products: subOrderProducts,
        //     });
        //     return newSubOrder._id;
        // }));

        // Create the main order with the subOrders
        const newOrder = await Order.create({
            orderId,
            shippingAddress,
            paymentMethod,
            customer,
            subOrders,
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all orders for a customer
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('subOrders.seller', 'businessName businessNumber businessEmail sellerID')
            .populate('subOrders.products', 'productName productPrice productQuantity seller');
        res.send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.getOrderById(req.params.id);
        res.send(order);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

// Update a specific order by ID
router.patch('/updateorder/:id', async (req, res) => {
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
router.delete('/deleteorder/:id', async (req, res) => {
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
