import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const HISTORY = `
  query {
    tokensBoughts(where: $where orderBy: blockTimestamp
      orderDirection: desc) {
        uri
        totalPrice
        tokenIds
        name
        buyer
        creator
        transactionHash
        blockTimestamp
      }
  }
`;

const getBuyerHistory = async (where: any): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY),
    variables: {
      where,
    },
    fetchPolicy: "no-cache",
  });
};

export default getBuyerHistory;
