const Log = require('../models/log/logSchema');
const logger = require('./logHandler');

// Log a message with level 'info'
const log = new Log({
    level: 'info',
    message: 'This is an info message',
    timestamp: new Date(),
    meta: { key: 'value' }
});

log.save().then(() => {
    logger.info('Message logged to console and MongoDB');
}).catch((err) => {
    logger.error(`Error while logging message: ${err}`);
});
