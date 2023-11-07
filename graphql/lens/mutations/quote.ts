import {
  OnchainQuoteRequest,
  CreateOnchainQuoteTypedDataDocument,
  CreateOnchainQuoteTypedDataMutation,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const createQuoteTypedData = async (
  request: OnchainQuoteRequest
): Promise<FetchResult<CreateOnchainQuoteTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateOnchainQuoteTypedDataDocument,
    variables: {
      request,
    },
  });
};
