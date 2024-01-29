import { FetchResult } from "@apollo/client";

import { apolloClient } from "../../../lib/lens/client";
import {
  CreateFollowTypedDataDocument,
  CreateFollowTypedDataMutation,
  FollowRequest,
} from "@/components/Home/types/generated";

const follow = async (
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

export default follow;
