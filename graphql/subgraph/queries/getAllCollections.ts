import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const COLLECTIONS = `
  query {
    collectionMinteds {
      basePrices
      uri
      tokenIds
      acceptedTokens
      amount
      collectionId
      owner
      name
      soldTokens
    }
  }
`;

const getAllCollections = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 20000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export default getAllCollections;
