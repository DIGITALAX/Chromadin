import {
  ProfileDocument,
  ProfileQuery,
  ProfileRequest,
} from "@/components/Home/types/generated";
import { apolloClient, authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const getOneProfile = async (
  request: ProfileRequest,
  connected: boolean
): Promise<FetchResult<ProfileQuery>> => {
  return await (connected ? apolloClient : authClient).query({
    query: ProfileDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};
