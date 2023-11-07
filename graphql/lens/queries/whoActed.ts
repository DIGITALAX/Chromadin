import {
  WhoActedOnPublicationRequest,
  WhoActedOnPublicationDocument,
  WhoActedOnPublicationQuery,
} from "@/components/Home/types/generated";
import { authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const whoActed = async (
  request: WhoActedOnPublicationRequest
): Promise<FetchResult<WhoActedOnPublicationQuery>> => {
  return await authClient.query({
    query: WhoActedOnPublicationDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
