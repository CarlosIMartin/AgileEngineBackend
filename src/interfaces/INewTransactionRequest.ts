import { typeEnum } from "./TypeEnum";

export interface INewTransactionRequest {
  type: string;
  amount: number;
}