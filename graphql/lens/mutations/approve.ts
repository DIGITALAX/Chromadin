import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  GenerateModuleCurrencyApprovalDataDocument,
  GenerateModuleCurrencyApprovalDataQuery,
  GenerateModuleCurrencyApprovalDataRequest,
} from "@/components/Home/types/generated";

const currencyApprove = async (
  request: GenerateModuleCurrencyApprovalDataRequest
): Promise<FetchResult<GenerateModuleCurrencyApprovalDataQuery>> => {
  return await apolloClient.mutate({
    mutation: GenerateModuleCurrencyApprovalDataDocument,
    variables: {
      request,
    },
  });
};

export default currencyApprove;
