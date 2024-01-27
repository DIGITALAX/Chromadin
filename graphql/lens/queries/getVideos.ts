import {
  PublicationsDocument,
  PublicationsQuery,
  PublicationsRequest,
} from "@/components/Home/types/generated";
import { apolloClient, authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const getPublications = async (
  request: PublicationsRequest,
  connected: boolean
): Promise<FetchResult<PublicationsQuery>> => {
  return await (connected ? apolloClient : authClient).query({
    query: PublicationsDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};
