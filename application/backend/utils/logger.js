const { createLogger, format, transports } = require('winston');
const { LogtailTransport } = require('@logtail/winston'); 
require('winston-daily-rotate-file');

const getLogger = (serviceName) => {
    const commonFormat = format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    );

    const serviceConfig = {
        'product-service': 'product',
        'transaction-service': 'transaction',
        'invoice-service': 'invoice',
        'user-service': 'user'
    };

    if (!serviceConfig[serviceName]) {
        throw new Error(`Unknown service: ${serviceName}`);
    }

    return createLogger({
        level: 'info',
        format: commonFormat,
        defaultMeta: { service: serviceName },
        transports: [
            new transports.Console(),
            new LogtailTransport({ sourceToken: process.env.LOGTAIL_TOKEN })
        ],
        exceptionHandlers: [
            new transports.Console(),
            new LogtailTransport({ sourceToken: process.env.LOGTAIL_TOKEN }), // For unhandled exceptions
        ],
        rejectionHandlers: [
            new transports.Console(),
            new LogtailTransport({ sourceToken: process.env.LOGTAIL_TOKEN }), // For unhandled promise rejections
        ],
    });
};

module.exports = { getLogger };
