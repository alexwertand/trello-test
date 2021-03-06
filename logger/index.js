const path = require('path');

let env = process.env.NODE_ENV
		, config = require('config').get('logger')
		, winston = require('winston')
		, morgan = require('morgan');

const logger = winston.createLogger({
	level: env == 'development' ? 'debug' : 'info'
	, transports: [new winston.transports.Console(config.console)]
});

const loggerExt = {

	getExtInfo() {
		const stack = new Error().stack;
		const caller = stack.split('\n')[3];
		const regexp = /(\S+)\s+\((.+):(\d+):(\d+)(?=\))/;
		const result = caller.match(regexp);
		return `<<${result[1]} at ${path.relative(process.cwd(), result[2])} ${result[3]}:${result[4]}>>`;
	}

	, info(...args) {
		const extInfo = env == 'development' ? this.getExtInfo() : '';
		logger.info.call(logger, ...args, extInfo);
	}

	, debug(...args) {
		const extInfo = env == 'development' ? this.getExtInfo() : '';
		logger.debug.call(logger, ...args, extInfo);
	}

	, warn(...args) {
		const extInfo = env == 'development' ? this.getExtInfo() : '';
		logger.warn.call(logger, ...args, extInfo);
	}

	, error(...args) {
		const extInfo = env == 'development' ? this.getExtInfo() : '';
		logger.error.call(logger, ...args, extInfo);
	}
};

const helpers = {

	getExtInfo() {
		const stack = new Error().stack;
		const caller = stack.split('\n')[3];
		const regexp = /(\S+)\s+\((.+):(\d+):(\d+)(?=\))/;
		const result = caller.match(regexp);
		return `<<${result[1]} at ${path.relative(process.cwd(), result[2])} ${result[3]}:${result[4]}>>`;
	}

};

const extLogLevels = [
	'debug'
	, 'info'
	, 'warn'
	, 'error'
	, 'log'
];


const handlers = {

	getExtInfo: helpers.getExtInfo

	, get(target, key, context) {
		const self = this;
		const value = target[key];
		if (typeof value !== 'function') {
			return Reflect.get(target, key, context);
		} else {
			return function() {
				return (env == 'development' && extLogLevels.includes(key)) ? value.call(target, ...arguments, self.getExtInfo()) : value.call(target, ...arguments);
			};
		}
	}
};

const loggerProxy = new Proxy(logger, handlers);

// update console.* loggers
if (!config.nativeConsole) {
	extLogLevels.forEach((loglevel) => {
		const originalHandler = global.console[loglevel];
		global.console[loglevel] = (...args) => {
			originalHandler.call(console, ...args, helpers.getExtInfo());
		};
	});
}

//Promise error
process.on('unhandledRejection', err => console.trace(err));

module.exports.express = morgan(env == 'development' ? 'dev' : 'combined');
module.exports.logger = loggerProxy;