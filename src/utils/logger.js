import winston from 'winston';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'cyan',
        info: 'blue',
        http: 'green',
        debug: 'magenta',
    }
};

let transports = [];

if (process.env.NODE_ENV === 'development') {
    transports.push(
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple(),
            )
        })
    );
} else {
    transports.push(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    );
}

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports
})

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} -${new Date().toLocaleTimeString()}`)
    next();
}

export { logger };