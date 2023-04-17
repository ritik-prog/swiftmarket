const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Completed', 'Failed', 'Refunded']
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentDetails: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        cartId: {
            type: String,
            unique: true,
            default: null
        },
        refundReason: {
            type: String
        },
        version: {
            type: Number,
            default: 1
        },
        previous: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

transactionSchema.pre('save', function (next) {
    if (this.isNew) {
        // Set the createdAt field to the current date
        this.createdAt = new Date();
    } else {
        // Increment the version number and store a copy of the previous version
        this.version++;
        this.previous = this.toObject();
        delete this.previous._id;
        delete this.previous.createdAt;
        delete this.previous.updatedAt;
    }
    next();
});

transactionSchema.methods.rollback = async function () {
    // Restore the previous version of the transaction and save it
    if (this.previous) {
        // First, create a new transaction using the previous version data
        const prevVersion = new this.constructor(this.previous);

        // Then, delete the current transaction and replace it with the previous version
        await this.delete();
        return prevVersion.save();
    } else {
        throw new Error('Cannot rollback: no previous version found');
    }
};

transactionSchema.methods.rollforward = async function () {
    // Find the next version of the transaction and restore it
    const nextVersion = await this.constructor.findOne({
        _id: this._id,
        version: this.version + 1
    });

    if (nextVersion) {
        // First, delete the current transaction and replace it with the next version
        await this.delete();
        return nextVersion.save();
    } else {
        throw new Error('Cannot rollforward: no next version found');
    }
};

transactionSchema.methods.updateStatus = function (newStatus) {
    if (this.status === newStatus) {
        throw new Error('The new status is the same as the current status.');
    }

    const allowedStatuses = ['Pending', 'Completed', 'Failed'];

    if (!allowedStatuses.includes(newStatus)) {
        throw new Error(`The status ${newStatus} is not allowed.`);
    }

    this.status = newStatus;
    return this.save();
}

module.exports = mongoose.model('Transaction', transactionSchema);
