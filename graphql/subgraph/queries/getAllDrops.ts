import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const DROPS = `
  query {
    dropCreateds(orderBy: dropId) {
      dropId
      dropURI
      creator
      collectionIds
      blockTimestamp
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
