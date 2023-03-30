const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRouter = require('./routes/authRoutes');
const connectDB = require('./config/db');

dotenv.config(); // load environment variables from .env file
connectDB(); // connect to MongoDB database

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());
app.use(helmet()); // adds security-related headers to HTTP response
app.use(morgan('combined')); // logs incoming HTTP requests

app.get('/', (req, res) => {
    res.send('Welcome to Node.js, Express.js in Docker');
});

app.use('/api/auth', authRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
