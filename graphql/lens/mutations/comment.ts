import {
  CreateOnchainCommentTypedDataMutation,
  OnchainCommentRequest,
  CreateOnchainCommentTypedDataDocument,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const createCommentTypedData = async (
  request: OnchainCommentRequest
): Promise<FetchResult<CreateOnchainCommentTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateOnchainCommentTypedDataDocument,
    variables: {
      request,
    },
  });
};
