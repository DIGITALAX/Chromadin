import {
  FollowRequest,
  CreateFollowTypedDataDocument,
  CreateFollowTypedDataMutation,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const createFollowTypedData = async (
  request: FollowRequest
): Promise<FetchResult<CreateFollowTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateFollowTypedDataDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default createFollowTypedData;
