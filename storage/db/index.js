const logger = require('logger').logger;
const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = global.Promise;

const db = mongoose.connection;

module.exports = db;
module.exports.disconnect = mongoose.disconnect;
module.exports.init = () => new Promise((res, rej) => {

    mongoose.connect(config.get('db:uri'), config.get('db:connect'));

    db.once('error', (err) => {
        rej(err);
    });

    db.once('open', () => {
        db.on('error', (err) => {
            logger.error(err);
        });

        res();
    });
});