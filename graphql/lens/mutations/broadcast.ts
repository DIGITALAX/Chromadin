import {
  BroadcastOnchainDocument,
  BroadcastOnchainMutation,
  BroadcastRequest,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const broadcast = async (
  request: BroadcastRequest
): Promise<FetchResult<BroadcastOnchainMutation>> => {
  return await apolloClient.mutate({
    mutation: BroadcastOnchainDocument,
    variables: {
      request,
    },
  });
};

export default broadcast;
