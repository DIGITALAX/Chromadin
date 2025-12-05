import {
  graphClient,
  graphPrintServer,
  graphWeb3Server,
  graphWeb3Client,
  graphTripleAServer,
  graphTripleAClient,
  graphFGOServer,
  graphFGOClient,
  graphGDNServer,
  graphGDNClient,
  graphCatalogServer,
  graphCatalogClient,
} from "@/app/lib/subgraph/client";
import {
  ApolloClient,
  FetchResult,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";

const PRINT_SAMPLER = `
    query($skip: Int) {
    orderCreateds(first: 20, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    blockNumber
    transactionHash
    blockTimestamp
      }

    }
`;

const WEB3_SAMPLER = `
    query($skip: Int) {
    orderCreateds(first: 20, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    blockNumber
    transactionHash
    blockTimestamp
      }

    }
`;

const TRIPLEA_SAMPLER = `
    query($skip: Int) {
    collectionPurchaseds(first: 20, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    blockNumber
    transactionHash
    blockTimestamp
      }

    }
`;

const FGO_SAMPLER = `
    query($skip: Int) {
    orders(first: 20, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    blockNumber
    transactionHash
    blockTimestamp
      }

    }
`;

const CATALOG_SAMPLER = `
    query($skip: Int) {
    orderCreateds(first: 20, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    blockNumber
    transactionHash
    blockTimestamp
      }

    }
`;

const GDN_SAMPLER = `
    query($skip: Int) {
    purchases(first: 20, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    blockNumber
    transactionHash
    blockTimestamp
      }

    }
`;

export const typeSwitch: { [key: string]: string } = {
  print: PRINT_SAMPLER,
  web3: WEB3_SAMPLER,
  triplea: TRIPLEA_SAMPLER,
  fgo: FGO_SAMPLER,
  catalog: CATALOG_SAMPLER,
  gdn: GDN_SAMPLER,
};

export const serverSwitch: {
  [key: string]: {
    server: ApolloClient<NormalizedCacheObject>;
    client: ApolloClient<NormalizedCacheObject>;
  };
} = {
  print: {
    server: graphPrintServer,
    client: graphClient,
  },
  web3: {
    server: graphWeb3Server,
    client: graphWeb3Client,
  },
  triplea: {
    server: graphTripleAServer,
    client: graphTripleAClient,
  },
  fgo: {
    server: graphFGOServer,
    client: graphFGOClient,
  },
  catalog: {
    server: graphCatalogServer,
    client: graphCatalogClient,
  },
  gdn: {
    server: graphGDNServer,
    client: graphGDNClient,
  },
};

export const getMoreSampler = async (
  type: string,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = (
    typeof window === "undefined"
      ? serverSwitch[type].server
      : serverSwitch[type].client
  ).query({
    query: gql(typeSwitch[type]),
    variables: {
      skip,
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
