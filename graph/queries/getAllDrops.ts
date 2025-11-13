import { graphClient, graphPrintServer } from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

const DROPS = `
  query {
    dropCreateds(orderBy: dropId) {
      designer
      dropId
      collections {
        collectionId
      }
      uri
      metadata {
        title
        cover 
      }
    }
  }
`;

const DROPS_NAME = `
  query($title: String, $designer: String) {
    dropCreateds(where: {metadata_: {title_contains_nocase: $title}, designer: $designer}) {
      designer
      dropId
      collections {
        collectionId
      }
      uri
      metadata {
        title
        cover 
      }
    }
  }
`;

const DROPS_CREATOR = `
  query($dropId: String, $designer: String) {
    dropCreateds(where: {dropId_not: $dropId, designer: $designer}) {
      designer
      dropId
      collections {
        collectionId
      }
      uri
      metadata {
        title
        cover 
      }
    }
  }
`;

export const getAllDrops = async (): Promise<FetchResult<any>> => {
  return (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(DROPS),
    fetchPolicy: "no-cache",
  });
};

export const getDropByName = async (
  title: string,
  designer: string
): Promise<FetchResult<any>> => {
  return (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(DROPS_NAME),
    variables: {
      title,
      designer,
    },
    fetchPolicy: "no-cache",
  });
};

export const getDropCreator = async (
  dropId: string,
  designer: string
): Promise<FetchResult<any>> => {
  return (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(DROPS_CREATOR),
    variables: {
      dropId,
      designer,
    },
    fetchPolicy: "no-cache",
  });
};
