import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const DROPS = `
  query {
    dropCreateds(orderBy: dropId) {
      dropId
      dropURI
      creator
      collectionIds
      blockNumber
    }
  }
`;

const DROPS_UPDATED = `
  query {
    updatedChromadinDropDropCreateds(orderBy: dropId) {
      dropId
      dropURI
      creator
      collectionIds
      blockNumber
    }
  }
`;

const getAllDrops = async (): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(DROPS),
    fetchPolicy: "no-cache",
  });
};

export default getAllDrops;

export const getAllDropsUpdated = async (): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(DROPS_UPDATED),
    fetchPolicy: "no-cache",
  });
};
