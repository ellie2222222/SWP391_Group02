const { createLogger, format, transports } = require('winston');
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

    const basePath = `logs/${serviceConfig[serviceName]}`;
    
    return createLogger({
        level: 'info',
        format: commonFormat,
        defaultMeta: { service: serviceName },
        transports: [
            new transports.DailyRotateFile({ filename: `${basePath}-error-%DATE%.log`, datePattern: 'YYYY-MM-DD', level: 'error', maxFiles: '30d' }),
            new transports.DailyRotateFile({ filename: `${basePath}-info-%DATE%.log`, datePattern: 'YYYY-MM-DD', level: 'info', maxFiles: '30d' }),
            new transports.File({ filename: `${basePath}-combined.log` })
        ]
    });
};

module.exports = { getLogger }