import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const DROPS = `
  query {
    dropCreateds(orderBy: dropId) {
      creator
      dropId
      collectionIds
      dropDetails {
        dropTitle
        dropCover }
    }
  }
`;

const DROPS_NAME = `
  query($dropTitle: String, $creator: String) {
    dropCreateds(where: {dropDetails_: {dropTitle_ends_with_nocase: $dropTitle, dropTitle_starts_with_nocase: $dropTitle}, creator: $creator}) {
      creator
      dropId
      collectionIds
      dropDetails {
        dropTitle
        dropCover }
    }
  }
`;

const DROPS_CREATOR = `
  query($dropId: String, $creator: String) {
    dropCreateds(where: {dropId_not: $dropId, creator: $creator}) {
      creator
      dropId
      collectionIds
      dropDetails {
        dropTitle
        dropCover }
    }
  }
`;

export const getAllDrops = async (): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(DROPS),
    fetchPolicy: "no-cache",
  });
};

export const getDropByName = async (
  dropTitle: string,
  creator: string
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(DROPS_NAME),
    variables: {
      dropTitle,
      creator,
    },
    fetchPolicy: "no-cache",
  });
};

export const getDropCreator = async (
  dropId: string,
  creator: string
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(DROPS_CREATOR),
    variables: {
      dropId,
      creator,
    },
    fetchPolicy: "no-cache",
  });
};
