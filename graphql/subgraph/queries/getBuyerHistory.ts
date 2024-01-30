import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const HISTORY = `
  query($first: Int, $skip: Int) {
    nftonlyOrderCreateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
      orderId
      totalPrice
      currency
      buyer
      blockTimestamp
      transactionHash
      subOrderCollectionIds
      }
  }
`;

const HISTORY_SPECIFIC = `
  query($buyer: String!, $first: Int, $skip: Int) {
    nftonlyOrderCreateds(where: {buyer: $buyer} orderBy: blockTimestamp
      orderDirection: desc, first: $first, skip: $skip) {
        orderId
        totalPrice
        currency
        buyer
        blockTimestamp
        transactionHash
        subOrderCollectionIds
      }
  }
`;

const getBuyerHistory = async (
  first: number,
  skip: number
): Promise<FetchResult<any>> => {
  return graphClient.query({
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
  return graphClient.query({
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
    orderCreateds(where: {buyer: $buyer}) {
        subOrderCollectionIds
    }
    nftonlyOrderCreateds(where: {buyer: $buyer}) {
      subOrderCollectionIds
  }
  }
`;

export const getOrders = async (
  buyer: `0x${string}`
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphClient.query({
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
