import {
  CreateOnchainMirrorTypedDataDocument,
  CreateOnchainMirrorTypedDataMutation,
  OnchainMirrorRequest,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";
export const mirror = async (
  request: OnchainMirrorRequest
): Promise<FetchResult<CreateOnchainMirrorTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateOnchainMirrorTypedDataDocument,
    variables: {
      request,
    },
  });
};
