import {
  WhoReactedPublicationDocument,
  WhoReactedPublicationQuery,
  WhoReactedPublicationRequest,
} from "@/components/Home/types/generated";
import { authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const whoReacted = async (
  request: WhoReactedPublicationRequest
): Promise<FetchResult<WhoReactedPublicationQuery>> => {
  return await authClient.query({
    query: WhoReactedPublicationDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
