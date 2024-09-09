const { createLogger, format, transports } = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');
require('winston-daily-rotate-file');
const moment = require('moment-timezone');

const logtail = new Logtail(process.env.LOGTAIL_TOKEN);

const localTimestampFormat = format((info) => {
    const localTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const localOffset = moment().format('Z'); // Local time zone offset in +HH:mm format
    info.timestamp = `${localTime} ${localOffset}`;
    return info;
});

const getLogger = (serviceName) => {
    const commonFormat = format.combine(
        localTimestampFormat(), // Use the custom local timestamp format
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    );

    const serviceConfig = {
        'product-service': 'product',
        'transaction-service': 'transaction',
        'invoice-service': 'invoice',
        'user-service': 'user',
    };

    if (!serviceConfig[serviceName]) {
        throw new Error(`Unknown service: ${serviceName}`);
    }

    return createLogger({
        level: 'info',
        format: commonFormat,
        defaultMeta: { service: serviceName },
        transports: [
            new LogtailTransport(logtail)
        ],
        exceptionHandlers: [
            new LogtailTransport(logtail)
        ],
        rejectionHandlers: [
            new LogtailTransport(logtail)
        ],
    });
};

module.exports = { getLogger };
