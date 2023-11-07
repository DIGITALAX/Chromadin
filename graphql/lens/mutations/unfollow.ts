import {
  UnfollowRequest,
  CreateUnfollowTypedDataDocument,
  CreateUnfollowTypedDataMutation,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const createUnfollowTypedData = async (
  request: UnfollowRequest
): Promise<FetchResult<CreateUnfollowTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateUnfollowTypedDataDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default createUnfollowTypedData;
