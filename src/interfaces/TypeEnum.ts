export enum typeEnum {
  credit = 'credit',
  debit = 'debit'
}

export function isValidTransaction(transactionType: string): boolean {
  for (let type in typeEnum) {
    if (transactionType === type) {
      return true;
    }
  }
  return false;
}