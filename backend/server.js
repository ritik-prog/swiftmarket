const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');

const PORT = process.env.PORT || 5500;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to Node.js, Express.js in Docker');
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
