import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes/index';
import cors from 'cors';

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(routes);
};
