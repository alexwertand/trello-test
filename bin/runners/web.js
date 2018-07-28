const logger = require('logger').logger;

const config = require('config');
const httpServer = require('httpServer');
const debug = require('debug')('myapp:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */
module.exports = () => 
    new Promise((resolve, reject) => {
        const port = normalizePort(config.get('httpServer:port'));
        httpServer.set('port', port);

        /**
         * Create HTTP server.
         */

        const server = http.createServer(httpServer);

        /**
         * Listen on provided port, on all network interfaces.
         */

        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);

        /**
         * Normalize a port into a number, string, or false.
         */

        function normalizePort(val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                return port;
            }

            return false;
        }

        /**
         * Event listener for HTTP server "error" event.
         */

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    logger.error(bind + ' requires elevated privileges');
                    reject();
                    break;
                case 'EADDRINUSE':
                    logger.error(bind + ' is already in use');
                    reject();
                    break;
                default:
                    throw error;
            }
        }

        /**
         * Event listener for HTTP server "listening" event.
         */

        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            logger.debug('http server listening on' + bind);

            resolve();
        }
    })
    .then(httpServer.initRoutes);