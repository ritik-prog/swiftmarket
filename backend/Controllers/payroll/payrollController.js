const Payroll = require("../../models/payroll/payrollSchema");
const WithdrawalRequest = require("../../models/payroll/withdrawalRequest");

// Get a payroll by ID
const getPayroll = async (req, res) => {
    try {
        let payroll = await Payroll.findOne({ user: req.seller._id });
        if (!payroll) {
            payroll = new Payroll({ user: req.seller._id, role: 'seller' });
            await payroll.save();
        }
        res.status(200).json({ success: true, amount: payroll.amount });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Request Withdrawal
const requestWithdrawal = async (req, res) => {
    try {
        console.log(req.body)
        let payroll = await Payroll.findOne({ user: req.seller._id });
        if (payroll.amount > 0) {
            payroll.amount -= req.body.amount;
            payroll.save();
            const withdrawalRequest = new WithdrawalRequest({
                user: req.seller._id,
                bankDetails: {
                    accountHolderName: req.body.accountHolderName,
                    bankName: req.body.bankName,
                    accountNumber: req.body.accountNumber,
                    ifscCode: req.body.ifscCode
                },
                amount: req.body.amount
            });
            await withdrawalRequest.save();
            res.status(200).json({ success: true, message: "The request to withdraw funds has been successfully initiated.", amount: payroll.amount });
        } else {
            res.status(499).json({ success: false, message: 'Insufficient balance' });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, error: "Something went wrong..." });
    }
};

const getWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await WithdrawalRequest.find({ user: req.seller._id });
        res.status(200).json({ status: 200, requests: withdrawalRequests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getPayroll,
    requestWithdrawal,
    getWithdrawalRequests
};