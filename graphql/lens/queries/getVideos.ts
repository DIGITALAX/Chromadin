import {
  PublicationsDocument,
  PublicationsQuery,
  PublicationsRequest,
} from "@/components/Home/types/generated";
import { apolloClient, authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const getPublicationsAuth = async (
  request: PublicationsRequest
): Promise<FetchResult<PublicationsQuery>> => {
  const data = await apolloClient.query({
    query: PublicationsDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  if (data?.error) {
    return await authClient.query({
      query: PublicationsDocument,
      variables: {
        request,
      },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });
  }

  return data;
};

export const getPublications = async (
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
