import {
  OnchainPostRequest,
  CreateOnchainPostTypedDataDocument,
  CreateOnchainPostTypedDataMutation,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const createPostTypedData = async (
  request: OnchainPostRequest
): Promise<FetchResult<CreateOnchainPostTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateOnchainPostTypedDataDocument,
    variables: {
      request,
    },
  });
};
