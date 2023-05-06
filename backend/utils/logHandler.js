const winston = require('winston');
const { transports } = winston;
const MongoDB = require('winston-mongodb').MongoDB;

const logs = require('../models/log/logSchema');

const createMongoTransport = (level) => {
    return new MongoDB({
        db: 'mongodb://myuser:mypassword@127.0.0.1:27017/?authSource=admin',
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

const customLogger = (role, action, req) => {
    const { method, url, query, body } = req;
    const routeName = req?.route ? req?.route?.path : 'unknown route';
    logger.info({
        message: `${role}`, meta: {
            action: action,
            username: req?.user?.username || "",
            method,
            url,
            query,
            routeName
        }
    });
}

module.exports = customLogger
