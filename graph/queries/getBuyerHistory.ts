import { graphClient,graphPrintServer } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const HISTORY = `
  query($first: Int, $skip: Int) {
    orderCreateds(where: {collection_: {origin: 0}}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      orderId
    totalPrice
    transactionHash
    currency
    buyer
    blockTimestamp
    collection {
      collectionId
      metadata {
        images
        title
      }
    }
      }
  }
`;

const HISTORY_SPECIFIC = `
  query($buyer: String!, $first: Int, $skip: Int) {
    orderCreateds(where: {
  and: [
    { buyer: $buyer },
    { collection_: { origin: 0 } }
  ]
}, orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
        orderId
    totalPrice
    transactionHash
    currency
    buyer
    blockTimestamp
    collection {
      collectionId
      metadata {
        images
        title
      }
    }
      }
  }
`;

const getBuyerHistory = async (
  first: number,
  skip: number
): Promise<FetchResult<any>> => {
  return (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(HISTORY),
    variables: {
      first,
      skip,
    },
    fetchPolicy: "no-cache",
  });
};

export default getBuyerHistory;

export const getBuyerHistorySpecific = async (
  buyer: string,
  first: number,
  skip: number
): Promise<FetchResult<any>> => {
  return (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(HISTORY_SPECIFIC),
    variables: {
      buyer,
      first,
      skip,
    },
    fetchPolicy: "no-cache",
  });
};

const ORDERS = `
  query($buyer: String!) {
    orderCreateds(where: {buyer: $buyer, {collection_: {origin: 0}}) {
        collections {
          collectionId
        }
    }
  }
`;

export const getOrders = async (
  buyer: `0x${string}`
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(ORDERS),
    variables: {
      buyer,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};



const ORDERS_QUICK = `
  query($buyer: String!) {
    orderCreateds(where: {buyer: $buyer}) {
      collection {
       uri
       
      }
    }
  }
`;

export const getOrdersQuick = async (
  buyer: `0x${string}`
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(ORDERS_QUICK),
    variables: {
      buyer,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
