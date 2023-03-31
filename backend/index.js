const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const https = require('https');
const fs = require('fs');


const authRouter = require('./Routes/auth/authRouter');
const sellerRouter = require('./Routes/seller/sellerRouter');

const connectDB = require('./Config/connectDB');

dotenv.config(); // load environment variables from .env file
connectDB(); // connect to MongoDB database

const app = express();
const PORT = process.env.PORT || 5500;

const whitelist = ['127.0.0.1', '::ffff:127.0.0.1'];
const bannedIps = [];

// Set up rate limiter
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    skip: (req, res) => {
        // Skip rate limiting for requests from whitelisted IPs
        return whitelist.includes(req.ip);
    },
    handler: (req, res) => {
        // Ban the client for 30 minutes
        res.status(429).send('Too many requests. Please try again later.');
        const banExpiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
        const clientIp = req.ip;
        bannedIps[clientIp] = banExpiresAt;
    },
});

// Use middlewares
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(limiter);
app.use(helmet()); // adds security-related headers to HTTP response
app.use(morgan('combined')); // logs incoming HTTP requests
app.use(cors());

// Set up CSRF protection
let csrfProtection;
if (process.env.NODE_ENV === 'production') {
    csrfProtection = csurf({
        cookie: {
            secure: true,
            httpOnly: true,
        },
    });
} else {
    csrfProtection = (req, res, next) => next();
}

//routes
app.get('/', (req, res) => {
    res.send('Welcome to Node.js, Express.js in Docker');
});

app.use('/api/auth', csrfProtection, authRouter);
app.use('/api/seller', csrfProtection, sellerRouter);

// Set up error handling middleware
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start server
if (process.env.NODE_ENV === 'production') {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
    https.createServer(options, app).listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}
