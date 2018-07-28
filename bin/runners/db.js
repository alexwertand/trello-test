const logger = require('logger').logger;

const db = require('storage/db');

module.exports = () => db.init().then(() => {
    logger.info('Connected to DB');

    db.once('close', () => {
        logger.info('Close connection to DB!!!');
    });
});