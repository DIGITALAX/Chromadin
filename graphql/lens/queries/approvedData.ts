import {
  GenerateModuleCurrencyApprovalDataDocument,
  GenerateModuleCurrencyApprovalDataQuery,
  GenerateModuleCurrencyApprovalDataRequest,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const approvedData = async (
  request: GenerateModuleCurrencyApprovalDataRequest
): Promise<FetchResult<GenerateModuleCurrencyApprovalDataQuery>> => {
  return await apolloClient.query({
    query: GenerateModuleCurrencyApprovalDataDocument,
    variables: {
      request,
    },
    fetchPolicy: "network-only",
  });
};

export default approvedData;
