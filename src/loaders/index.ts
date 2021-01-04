import { Container } from 'typedi';
import expressLoader from './Express';
import logger from './Logger';

export default async ({ expressApp }) => {
  process.on('uncaughtException', (err) => {
    logger.error({action: 'Fatal error', data: {error: err}});
    setTimeout(() => {
      process.exit(1);
    }, 1000).unref();
  });

  process.on('unhandledRejection', (err) => {
    logger.error({action: 'Fatal error', data: {error: err}});
    setTimeout(() => {
      process.exit(1);
    }, 1000).unref();
  });

  process.on('SIGTERM', (err) => {
    logger.error({action: 'Stopping...', data: {error: err}});
    setTimeout(() => {
      process.exit(1);
    }, 100).unref();
  });

  await expressLoader({ app: expressApp });

  logger.info('Express loaded');
};
