import express from 'express';
import config from './config';
import logger from './loaders/Logger';

async function startServer() {
  const app = express();

  // Se importan y cargan los Loaders en la aplicacion
  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, () => {
    logger.info({action: `
        ###############################################
          AGILE BACKEND RUNNING ON PORT ${config.port}
        ###############################################
      `});
  }).on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });
}

startServer();
