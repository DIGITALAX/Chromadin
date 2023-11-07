import {
  PublicationsDocument,
  PublicationsQuery,
  PublicationsRequest,
} from "@/components/Home/types/generated";
import { apolloClient, authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const profilePublicationsAuth = async (
  request: PublicationsRequest
): Promise<FetchResult<PublicationsQuery>> => {
  return await apolloClient.query({
    query: PublicationsDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};

export const profilePublications = async (
  request: PublicationsRequest
): Promise<FetchResult<PublicationsQuery>> => {
  return await authClient.query({
    query: PublicationsDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};
