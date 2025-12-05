export type TransactionType =
  | "print"
  | "web3"
  | "triplea"
  | "catalog"
  | "gdn"
  | "fgo";

export interface Transaction {
  type: TransactionType;
  transactionHash: string;
  blockTimestamp: string;
  blockNumber: string;
}
