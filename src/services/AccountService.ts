import { Service } from 'typedi';
import { ITransaction } from '../interfaces/ITransaction';
import logger from '../loaders/logger';

@Service()
export class AccountService {
  private amount: number;
  private lock: boolean;
  private history: Array<ITransaction>;

  constructor() {
    this.amount = 0,
    this.lock = false,
    this.history = []
  }

  public getLock(): boolean {
    return this.lock;
  }

  public setLock(lock: boolean) {
    this.lock = lock;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number) {
    this.amount = amount;
  }

  public getHistory(): Array<ITransaction> {
    return this.history;
  }

  public addToHistory(transaction: ITransaction) {
    this.history.push(transaction);
  }

  public getTransaction(id: string): ITransaction | undefined {
    return this.history.find(t => t.id === id);
  }

}