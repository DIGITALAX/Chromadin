import {
  ProfilesDocument,
  ProfilesQuery,
  ProfilesRequest,
} from "@/components/Home/types/generated";
import { authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const getProfiles = async (
  request: ProfilesRequest
): Promise<FetchResult<ProfilesQuery>> => {
  return await authClient.query({
    query: ProfilesDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default getProfiles;
