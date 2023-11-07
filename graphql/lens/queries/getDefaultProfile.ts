import {
  DefaultProfileDocument,
  DefaultProfileQuery,
  DefaultProfileRequest,
} from "@/components/Home/types/generated";
import { authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const getDefaultProfile = async (
  request: DefaultProfileRequest
): Promise<FetchResult<DefaultProfileQuery>> => {
  return await authClient .query({
    query: DefaultProfileDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default getDefaultProfile;
