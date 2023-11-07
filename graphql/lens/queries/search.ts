import {
  SearchProfilesDocument,
  SearchProfilesQuery,
  ProfileSearchRequest,
} from "@/components/Home/types/generated";
import { authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const searchProfile = async (
  request: ProfileSearchRequest
): Promise<FetchResult<SearchProfilesQuery>> => {
  return await authClient.query({
    query: SearchProfilesDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
