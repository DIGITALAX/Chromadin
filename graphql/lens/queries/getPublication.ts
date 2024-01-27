import {
  PublicationDocument,
  PublicationQuery,
  PublicationRequest,
} from "@/components/Home/types/generated";
import { apolloClient, authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const getPublication = async (
  request: PublicationRequest,
  connected: boolean
): Promise<FetchResult<PublicationQuery>> => {
  return await (connected ? apolloClient : authClient).query({
    query: PublicationDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};
