import { Container, Service } from 'typedi';
import logger from '../loaders/Logger';
import { Request, Response } from 'express';
import { AccountService } from '../services/AccountService';
import { ITransactionsResponse } from '../interfaces/ITransactionsResponse';
import { isValidTransaction, typeEnum } from '../interfaces/TypeEnum';
import { INewTransactionRequest } from '../interfaces/INewTransactionRequest';
import { INewTransactionResponse } from '../interfaces/INewTransactionResponse';
import { ITransaction } from '../interfaces/ITransaction';
import { formatDate, getNewUUID } from '../utils';
import { IFindTransactionRequest } from '../interfaces/IFindTransactionRequest';
import { IAccountBalanceResponse } from '../interfaces/IAccountBalanceResponse';

@Service()
export class AccountController {

  private accountService = Container.get(AccountService);

  public async getTransactionsHistory(req: Request, res: Response) {
    logger.info({
      action: 'Request to getTransactionsHistory',
    });

    if (!this.accountService.getLock()) {
      try {
        const response: ITransactionsResponse = {
          transactions: this.accountService.getHistory(),
        }

        logger.info({
          action: 'Success: Retrieving transactions history',
        });

        res.writeHead(200);
        res.end(JSON.stringify(response.transactions));
      } catch (error) {
        logger.error({
          action: `Error: ${error.message}`,
        });

        res.writeHead(500);
      }
    } else {
      logger.warn({
        action: 'Cannot get a transaction history due to ongoing Write operation',
      });

      res.writeHead(500);
    }
  }

  public async postNewTransaction(req: Request, res: Response) {
    logger.info({
      action: 'Request to postNewTransaction',
    });

    if (!this.accountService.getLock()) {
      try {
        const newTransactionRequest: INewTransactionRequest = req.body as INewTransactionRequest;
        let errorResponse;

        if (!isValidTransaction(newTransactionRequest.type)) {
          logger.error({
            action: 'Invalid transaction type',
          });

          errorResponse = { error: 'Invalid transaction type' }

          res.writeHead(400);
          res.end(JSON.stringify(errorResponse));
          return;
        }

        if (isNaN(newTransactionRequest.amount)) {
          logger.error({
            action: 'Invalid amount value type',
          });

          errorResponse = { error: 'Invalid amount value type' }

          res.writeHead(400);
          res.end(JSON.stringify(errorResponse));
          return;
        }

        if (newTransactionRequest.amount < 0.01) {
          logger.error({
            action: 'Invalid amount value',
          });

          errorResponse = { error: 'Invalid amount value' }

          res.writeHead(400);
          res.end(JSON.stringify(errorResponse));
          return;
        }

        let response: INewTransactionResponse;

        // If it's a CREDIT transaction
        if (newTransactionRequest.type === typeEnum.credit) {
          this.accountService.setLock(true);
          this.accountService.setAmount(this.accountService.getAmount() + newTransactionRequest.amount);

          const transaction: ITransaction = {
            id: getNewUUID(),
            type: typeEnum.credit,
            amount: newTransactionRequest.amount,
            effectiveDate: formatDate(new Date())
          }

          this.accountService.addToHistory(transaction);

          response = { transaction: transaction }

          this.accountService.setLock(false);

          logger.info({
            action: 'Success: Credit transaction created',
          });

          res.writeHead(200);
          res.end(JSON.stringify(response.transaction));
        }

        // If it's a DEBIT transaction
        if (newTransactionRequest.type === typeEnum.debit) {
          if (this.accountService.getAmount() - newTransactionRequest.amount < 0.0) {
            logger.error({
              action: 'Refused transaction due to negative amount within the system',
            });

            errorResponse = { error: 'Refused transaction due to negative amount within the system' }

            res.writeHead(403);
            res.end(JSON.stringify(errorResponse));
            return;
          }

          this.accountService.setLock(true);
          this.accountService.setAmount(this.accountService.getAmount() - newTransactionRequest.amount);

          const transaction: ITransaction = {
            id: getNewUUID(),
            type: typeEnum.debit,
            amount: newTransactionRequest.amount,
            effectiveDate: formatDate(new Date())
          }

          this.accountService.addToHistory(transaction);

          response = { transaction: transaction }

          this.accountService.setLock(false);

          logger.info({
            action: 'Success: Debit transaction created',
          });

          res.writeHead(200);
          res.end(JSON.stringify(response.transaction));
        }
      } catch (error) {
        logger.error({
          action: `Error: ${error.message}`,
        });

        this.accountService.setLock(false);
        res.writeHead(404);
      }
    } else {
      logger.warn({
        action: 'Cannot get a transaction history due to ongoing Write operation',
      });

      res.writeHead(500);
    }
  }

  public async getOneTransaction(req: Request, res: Response) {
    logger.info({
      action: 'Request to getOneTransaction',
    });

    if (!this.accountService.getLock()) {
      try {
        const getOneTransactionRequest: IFindTransactionRequest = req.body as IFindTransactionRequest;

        let errorResponse;

        if (getOneTransactionRequest.transactionId === '') {
          logger.error({
            action: 'Blank id',
          });

          errorResponse = { error: 'Blank id' }

          res.writeHead(400);
          res.end(JSON.stringify(errorResponse));
          return;
        }

        const transaction: ITransaction = this.accountService.getTransaction(getOneTransactionRequest.transactionId);

        let response: INewTransactionResponse;

        if (transaction === undefined) {
          logger.error({
            action: 'Transaction not found',
          });

          errorResponse = { error: 'Transaction not found' }

          res.writeHead(404);
          res.end(JSON.stringify(errorResponse));
        } else {
          response = { transaction: transaction };

          logger.info({
            action: 'Success: Transaction found',
          });

          res.writeHead(200);
          res.end(JSON.stringify(response.transaction));
        }
      } catch (error) {
        logger.error({
          action: `Error: ${error.message}`,
        });

        res.writeHead(500);
      }

    } else {
      logger.warn({
        action: 'Cannot get a transaction history due to ongoing Write operation',
      });

      res.writeHead(500);
    }
  }

  public async getBalance(req: Request, res: Response) {
    logger.info({
      action: 'Request to getBalance',
    });

    if (!this.accountService.getLock()) {
      try {
        const response: IAccountBalanceResponse = {
          amount: this.accountService.getAmount()
        }

        logger.info({
          action: 'Success: Retrieving balance',
        });
        
        res.writeHead(200);
        res.end(JSON.stringify(response));
      } catch (error) {
        logger.error({
          action: `Error: ${error.message}`,
        });

        res.writeHead(500);
      }
    } else {
      logger.warn({
        action: 'Cannot get a transaction history due to ongoing Write operation',
      });

      res.writeHead(500);
    }
  }

}


