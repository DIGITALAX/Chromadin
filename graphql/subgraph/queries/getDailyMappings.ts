import { FetchResult, gql } from "@apollo/client";
import { graphClientDash } from "@/lib/subgraph/client";

const MAPPINGS = `
  query {
    dailyMappingsAddeds(orderBy: blockTimestamp, orderDirection: desc, first: 1) {
      id
      _topMirrorers
      _topCollectors
      _topPosters
      _topFollowed
      _unique
      blockTimestamp
      _revenueChange
      _highestSpend
      _amountToCollect72
      _amountToCollect
      _graph
    }
  }
`;

const getDailyMappings = async (): Promise<FetchResult<any>> => {
  return graphClientDash.query({
    query: gql(MAPPINGS),
    fetchPolicy: "no-cache",
  });
};

export default getDailyMappings;
