const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const https = require('https');
const fs = require('fs');

const authRouter = require('./Routes/auth/authRouter');
const sellerRouter = require('./Routes/seller/sellerRouter');
const adminRouter = require('./Routes/admin/adminRouter');
const productRouter = require('./Routes/product/productRouter');
const superAdminRouter = require('./Routes/superadmin/superAdminRouter');

const rateLimiterMiddleware = require('./middleware/rateLimitermiddleware.js');

const connectDB = require('./utils/connectDB');
const ipBannedMiddleware = require('./middleware/checkIpBanned');
const assignUniqueIdentity = require('./middleware/assignUniqueID');

dotenv.config(); // load environment variables from .env file
connectDB(); // connect to MongoDB database

const app = express();
const PORT = process.env.PORT || 5500;

// Use middlewares
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());// adds security-related headers to HTTP response

app.use(morgan('combined')); // logs incoming HTTP requests
const corsConfig = {
    origin: true,
    credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});
app.use(rateLimiterMiddleware);
app.use(ipBannedMiddleware);
app.use(assignUniqueIdentity);

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

app.use('/api/auth', csrfProtection, authRouter);
app.use('/api/seller', csrfProtection, sellerRouter);
app.use('/api/admin', csrfProtection, adminRouter);
app.use('/api/product', csrfProtection, productRouter);
app.use('/api/superadmin', csrfProtection, superAdminRouter);

// Set up error handling middleware
app.use((req, res, next) => {
    res.status(404).send({ error: 'not_found', message: 'Not Found' });
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
