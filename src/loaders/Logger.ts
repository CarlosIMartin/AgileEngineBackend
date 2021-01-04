import winston from 'winston';

let logger: winston.Logger;

  logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({all: true}),
    ),
    transports: [
      new winston.transports.Console({
        level: 'debug',
      }),
    ],

  });

export default logger;
