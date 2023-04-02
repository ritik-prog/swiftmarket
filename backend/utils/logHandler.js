const winston = require('winston');
const { transports } = winston;
const MongoDB = require('winston-mongodb').MongoDB;

const logs = require('../models/log/logSchema');

const createMongoTransport = (level) => {
    return new MongoDB({
        db: logs.db,
        collection: 'logs',
        level: level,
        metaKey: 'meta',
        storeHost: true,
        handleExceptions: true,
        handleRejections: true,
        capped: true,
        cappedMax: 100000,
        cappedSize: 1000000,
        options: {
            useUnifiedTopology: true
        },
        leaveConnectionOpen: true,
    });
};

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new transports.Console(),
        createMongoTransport('info')
    ]
});

module.exports = logger;
