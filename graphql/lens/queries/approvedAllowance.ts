import {
  ApprovedModuleAllowanceAmountDocument,
  ApprovedModuleAllowanceAmountQuery,
  ApprovedModuleAllowanceAmountRequest,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const approvedModuleAllowance = async (
  request: ApprovedModuleAllowanceAmountRequest
): Promise<FetchResult<ApprovedModuleAllowanceAmountQuery>> => {
  return await apolloClient.query({
    query: ApprovedModuleAllowanceAmountDocument,
    variables: {
      request,
    },
    fetchPolicy: "network-only",
  });
};

export default approvedModuleAllowance;
