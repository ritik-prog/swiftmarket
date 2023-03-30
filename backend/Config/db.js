const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Enable mongoose debugging
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

mongoose.set('runValidators', true); // enable running validators on update queries

mongoose.plugin(schema => {
    // add createdAt and updatedAt timestamps to documents
    schema.add({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });

    schema.pre('findOneAndUpdate', function () {
        // set the updatedAt field when updating a document
        this.set({ updatedAt: new Date() });
    });
});

module.exports = connectDB;
