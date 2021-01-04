import express, { Request, Response } from 'express';
import Container from 'typedi';
import { AccountController } from '../controllers/AccountController';

const routes = express();

const urlAccount = '/account';

const accountController = Container.get(AccountController);

routes.get(`${urlAccount}/history`, (req: Request, res: Response) => {
  accountController.getTransactionsHistory(req, res);
})

routes.post(`${urlAccount}/newTransaction`, (req: Request, res: Response) => {
  accountController.postNewTransaction(req, res);
})

routes.get(`${urlAccount}/transaction`, (req: Request, res: Response) => {
  accountController.getOneTransaction(req, res);
})

routes.get(`${urlAccount}/balance`, (req: Request, res: Response) => {
  accountController.getBalance(req, res);
})

export default routes;