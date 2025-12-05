import { FunctionComponent, JSX, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useSampler from "../hooks/useSampler";
import FetchMoreLoading from "../../Common/modules/FetchMoreLoading";
import { Transaction, TransactionType } from "../types/sampler.types";

const TYPE_COLORS: Record<TransactionType, string> = {
  print: "bg-rosa",
  web3: "bg-azul",
  triplea: "bg-verde",
  catalog: "bg-cit",
  gdn: "bg-moda",
  fgo: "bg-b1",
};

const TYPES: TransactionType[] = [
  "print",
  "web3",
  "triplea",
  "catalog",
  "gdn",
  "fgo",
];

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
};

const truncateHash = (hash: string): string => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const generateRandomHex = (length: number): string => {
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const generateRandomBlock = (): string => {
  return String(Math.floor(Math.random() * 90000000) + 10000000);
};

const generateRandomTimestamp = (): string => {
  const now = Date.now();
  const randomPast = now - Math.floor(Math.random() * 86400000 * 30);
  return String(Math.floor(randomPast / 1000));
};

const PlaceholderRow: FunctionComponent<{ index: number }> = ({ index }) => {
  const [data, setData] = useState({
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    block: generateRandomBlock(),
    timestamp: generateRandomTimestamp(),
    hash: generateRandomHex(64),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        block: generateRandomBlock(),
        timestamp: generateRandomTimestamp(),
        hash: generateRandomHex(64),
      });
    }, 150 + index * 50);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="relative flex flex-row w-full h-fit py-2 border-b border-white/20 opacity-40">
      <div className="relative flex w-1/4 items-center">
        <span
          className={`relative flex px-2 py-1 text-xxs text-black font-arcade uppercase rounded-sm ${TYPE_COLORS[data.type]}`}
        >
          {data.type}
        </span>
      </div>
      <div className="relative flex w-1/4 text-white/70 text-xxs font-arcade items-center">
        {data.block}
      </div>
      <div className="relative flex w-1/4 text-white/70 text-xxs font-arcade items-center">
        {formatTimestamp(data.timestamp)}
      </div>
      <div className="relative flex w-1/4 items-center">
        <span className="relative flex text-cit text-xxs font-arcade">
          {truncateHash(data.hash)}
        </span>
      </div>
    </div>
  );
};

const Sampler: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const {
    transactionsLoading,
    hasMore,
    getMoreTransactions,
    moreTransactionsLoading,
    transactions,
  } = useSampler();

  return (
    <div className="relative flex flex-col w-full h-[25rem] p-4 gap-3">
      <div className="relative flex flex-row w-full h-fit border-b border-white pb-2">
        <div className="relative flex w-1/4 text-white text-sm font-arcade">
          {dict?.samplerData?.type}
        </div>
        <div className="relative flex w-1/4 text-white text-sm font-arcade">
          {dict?.samplerData?.block}
        </div>
        <div className="relative flex w-1/4 text-white text-sm font-arcade">
          {dict?.samplerData?.time}
        </div>
        <div className="relative flex w-1/4 text-white text-sm font-arcade">
          {dict?.samplerData?.hash}
        </div>
      </div>
      {transactionsLoading ? (
        <div className="relative flex w-full h-full items-center justify-center">
          <FetchMoreLoading size="8" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="relative flex flex-col w-full h-full overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <PlaceholderRow key={i} index={i} />
          ))}
        </div>
      ) : (
        <div
          id="samplerScroll"
          className="relative flex flex-col w-full h-full overflow-y-scroll"
        >
          <InfiniteScroll
            dataLength={transactions.length}
            next={getMoreTransactions}
            hasMore={hasMore}
            loader={moreTransactionsLoading && <FetchMoreLoading size="6" />}
            scrollableTarget="samplerScroll"
            className="relative flex flex-col w-full gap-2"
          >
            {transactions.map((tx: Transaction, index: number) => (
              <div
                key={`${tx.transactionHash}-${index}`}
                className="relative flex flex-row w-full h-fit py-2 border-b border-white/20 hover:bg-white/5"
              >
                <div className="relative flex w-1/4 items-center">
                  <span
                    className={`relative flex px-2 py-1 text-xxs text-black font-arcade uppercase rounded-sm ${TYPE_COLORS[tx.type]}`}
                  >
                    {tx.type}
                  </span>
                </div>
                <div className="relative flex w-1/4 text-white/70 text-xxs font-arcade items-center">
                  {tx.blockNumber}
                </div>
                <div className="relative flex w-1/4 text-white/70 text-xxs font-arcade items-center">
                  {formatTimestamp(tx.blockTimestamp)}
                </div>
                <div className="relative flex w-1/4 items-center">
                  <a
                    href={`https://explorer.lens.xyz/tx/${tx.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex text-cit text-xxs font-arcade hover:opacity-70 cursor-pointer"
                  >
                    {truncateHash(tx.transactionHash)}
                  </a>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default Sampler;
