const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const host = process.env.USING_DOCKER === "true" ? "mongo" : "127.0.0.1";
        const conn = await mongoose.connect(`mongodb://myuser:mypassword@${host}:27017/?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
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

mongoose.set('strictQuery', true);

module.exports = connectDB;
