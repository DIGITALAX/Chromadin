import {
  FeedDocument,
  FeedQuery,
  FeedRequest,
} from "@/components/Home/types/generated";
import { apolloClient, authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const feedTimelineAuth = async (
  request: FeedRequest
): Promise<FetchResult<FeedQuery>> => {
  return await apolloClient.query({
    query: FeedDocument,
    variables: {
      request,
    },
    fetchPolicy: "network-only",
  });
};

export const feedTimeline = async (
  request: FeedRequest
): Promise<FetchResult<FeedQuery>> => {
  return await authClient.query({
    query: FeedDocument,
    variables: {
      request,
    },
    fetchPolicy: "network-only",
  });
};
