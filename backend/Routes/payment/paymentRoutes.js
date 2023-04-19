const Transaction = require("../../models/transaction/transactionSchema");
const authenticateMiddleware = require("../../middleware/authenticateMiddleware");

const router = require("express").Router();
const stripe = require("stripe")("sk_test_51HTOQGCH0xfOm9H95fTqnzn5FXJ004IjhWnpb7EtesBucXomOPnww0bmUmJ4hJWgATawLLW7UEngu9QaYDSFUlzi00qJb5ijjb");

router.post("/intent", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: 'inr',
    payment_method_types: ['card'],
  });
  res.json({ client_secret: paymentIntent.client_secret });
});

// Create a transaction
router.post("/transaction", [authenticateMiddleware], async (req, res) => {
  const { type, amount, paymentMethod } = req.body;

  try {
    const findOldTransaction = await Transaction.find({
      customer: req.user._id,
      status: 'Pending'
    }).exec();

    if (findOldTransaction.length === 0) {
      try {
        const newTransaction = new Transaction({
          type,
          amount,
          status: "Pending",
          paymentMethod,
          customer: req.user._id
        });

        await newTransaction.save();

        // Delay the status update by 5 minutes
        setTimeout(async () => {
          const transaction = await Transaction.find({ _id: newTransaction._id });
          if (transaction.status === "Pending") {
            transaction.status = "Failed";
            await transaction.save();
            console.log(`Transaction ${transaction._id} has failed`);
          }
        }, 300000); // 5 minutes in milliseconds

        res.status(201).json({ transaction: newTransaction, status: 200 });
      } catch (error) {
        console.error(error);
        res.status(499).json({ message: "Kindly wait for a while..." });
      }
    } else {
      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000; // 5 minutes ago in milliseconds
      const oldTransaction = findOldTransaction[0];
      if (oldTransaction?.createdAt.getTime() < fiveMinutesAgo) {
        // transaction is older than 5 minutes, change status to 'Failed'
        oldTransaction.status = 'Failed';
        await oldTransaction.save();

        // create new transaction
        const newTransaction = new Transaction({
          type,
          amount,
          status: "Pending",
          paymentMethod,
          customer: req.user._id
        });

        await newTransaction.save();

        // Delay the status update by 5 minutes
        setTimeout(async () => {
          const transaction = await Transaction.findById(newTransaction._id);
          if (transaction && transaction?.status === "Pending") {
            transaction.status = "Failed";
            await transaction.save();
            console.log(`Transaction ${transaction._id} has failed`);
          }
        }, 300000); // 5 minutes in milliseconds

        res.status(200).json({ transaction: newTransaction, status: 200 });
      } else {
        // transaction is less than 5 minutes old
        res.status(499).json({ message: "Kindly try after 5 minutes" });
      }
    }
  } catch (err) {
    console.log(err)
  }
});

// Update a transaction
router.put("/transaction/:transactionId", [authenticateMiddleware], async (req, res) => {
  const { status } =
    req.body;
  console.log(req.params.transactionId)
  try {
    const transaction = await Transaction.findOne({
      trans_id: req.params.transactionId
    });
    
    if (String(req.user._id) === String(transaction.customer)) {

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      transaction.status = status || transaction.status;

      const updatedTransaction = await transaction.save();

      res.status(200).json({ transaction: updatedTransaction, status: 200 });
    } else {
      res.status(499).json({ message: 'Something went wrong...', status: 499 })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
