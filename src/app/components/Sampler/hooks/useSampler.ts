import { useEffect, useState } from "react";
import { Transaction, TransactionType } from "../types/sampler.types";
import { getMoreSampler } from "../../../../../graph/queries/getSampler";
import { dataSwitch } from "@/app/lib/constants";

const useSampler = () => {
  const [transactionsLoading, setTransactionsLoading] =
    useState<boolean>(false);
  const [moreTransactionsLoading, setMoreTransactionsLoading] =
    useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasMore, setHasMore] = useState<{
    print: boolean;
    web3: boolean;
    triplea: boolean;
    catalog: boolean;
    gdn: boolean;
    fgo: boolean;
  }>({
    print: true,
    web3: true,
    triplea: true,
    catalog: true,
    gdn: true,
    fgo: true,
  });
  const [cursor, setCursor] = useState<{
    web3: number;
    triplea: number;
    print: number;
    catalog: number;
    gdn: number;
    fgo: number;
  }>({
    web3: 0,
    triplea: 0,
    print: 0,
    catalog: 0,
    gdn: 0,
    fgo: 0,
  });

  const getTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const allTransactions: Transaction[] = [];
      const newHasMore = { ...hasMore };
      const newCursor = { ...cursor };

      await Promise.all(
        Object.entries(hasMore).map(async (entry) => {
          const type = entry[0] as TransactionType;
          if (entry[1]) {
            const datos = await getMoreSampler(type, cursor[type]);
                  console.log(type, cursor[type],{datos})
            if (datos?.data) {
              const items = datos?.data?.[dataSwitch[type]] || [];
              if (items.length < 20) {
                newHasMore[type] = false;
              }
              newCursor[type] = cursor[type] + items.length;
              items.forEach((item: any) => {
                allTransactions.push({
                  type,
                  transactionHash: item.transactionHash,
                  blockTimestamp: item.blockTimestamp,
                  blockNumber: item.blockNumber,
                });
              });
            }
          }
        })
      );

      allTransactions.sort(
        (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
      );


      setHasMore(newHasMore);
      setCursor(newCursor);
      setTransactions(allTransactions);
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionsLoading(false);
  };

  const getMoreTransactions = async () => {
    if (!Object.values(hasMore).some((v) => v)) return;
    setMoreTransactionsLoading(true);
    try {
      const newTransactions: Transaction[] = [];
      const newHasMore = { ...hasMore };
      const newCursor = { ...cursor };

      await Promise.all(
        Object.entries(hasMore).map(async (entry) => {
          const type = entry[0] as TransactionType;
          if (entry[1]) {
            const datos = await getMoreSampler(type, cursor[type]);
            if (datos?.data) {
              const items = datos?.data?.[dataSwitch[type]] || [];
              if (items.length < 20) {
                newHasMore[type] = false;
              }
              newCursor[type] = cursor[type] + items.length;
              items.forEach((item: any) => {
                newTransactions.push({
                  type,
                  transactionHash: item.transactionHash,
                  blockTimestamp: item.blockTimestamp,
                  blockNumber: item.blockNumber,
                });
              });
            }
          }
        })
      );

      newTransactions.sort(
        (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
      );

      setHasMore(newHasMore);
      setCursor(newCursor);
      setTransactions((prev) =>
        [...prev, ...newTransactions].sort(
          (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreTransactionsLoading(false);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return {
    transactionsLoading,
    hasMore: Object.values(hasMore).some((v) => v),
    getMoreTransactions,
    moreTransactionsLoading,
    transactions,
  };
};

export default useSampler;
